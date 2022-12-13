// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "base64/base64.sol";
import "solmate/auth/Owned.sol";
import "solmate/tokens/ERC721.sol";
import "solmate/utils/LibString.sol";
import "./IERC5192.sol";
import "./PinkyPromiseSvg.sol";

contract PinkyPromise is ERC721, IERC5192, Owned {
    using LibString for uint256;

    struct PromiseData {
        PromiseColor color;
        uint16 height;
        string title;
        string body;
    }

    struct Promise {
        PromiseData data;
        address[] signees;
        uint256[] tokenIds;
        uint256 signedOn;
        //
        // Promise.state keeps track of the state of the promise by using a counter:
        //
        //   state <  signees.length         => contract just created
        //   state >= signees.length         => contract signed
        //   state == signees.length * 2     => contract nullified
        //   state == signees.length * 2 + 1 => contract discarded
        //
        // See also state(promiseId).
        //
        uint256 state;
    }

    enum PromiseColor {
        Pinky,
        Electric,
        RedAlert,
        Solemn
    }

    enum PromiseState {
        None,
        Draft,
        Final,
        Nullified,
        Discarded
    }

    enum SigningState {
        None, // default state is only used to enforce unique signees, see newPromise()
        Pending, // awaiting signature
        Signed,
        NullRequest // nullification requested (implies signed)
    }

    uint256 private _latestPromiseId; // 0
    uint256 private _latestTokenId; // 0

    mapping(uint256 => Promise) private _promises;
    mapping(uint256 => uint256) private _promiseIdsByTokenId;
    mapping(address => uint256[]) private _promiseIdsBySignee;

    // promiseId => signer => SigningState
    // We use SigningState rather than a boolean in this mapping,
    // so we can rely on SigningState.None (the default) to ensure that
    // Promise.signees only contain unique signatures (see newPromise()).
    mapping(uint256 => mapping(address => SigningState)) private _signingStates;

    address private _ensRegistry;

    // should point to https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary
    address private _bpbDateTime;

    // promise state change
    event PromiseUpdate(uint256 indexed promiseId, PromiseState state);

    // single signature added
    event AddSignature(uint256 indexed promiseId, address indexed signer);

    // request to nullify the promise
    event NullifyRequest(uint256 indexed promiseId, address indexed signer);
    event CancelNullifyRequest(uint256 indexed promiseId, address indexed signer);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Owned(msg.sender) {}

    // ERC721 + ERC5192 related methods
    // ================================

    function supportsInterface(bytes4 interfaceId) public view override (ERC721) returns (bool) {
        return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        require(_ownerOf[tokenId] != address(0), "PinkyPromise: tokenId not assigned");
        return true; // always locked
    }

    function transferFrom(address, address, uint256) public pure override {
        revert("PinkyPromise: transfers disallowed");
    }

    function safeTransferFrom(address, address, uint256) public pure override {
        revert("PinkyPromise: transfers disallowed");
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) public pure override {
        revert("PinkyPromise: transfers disallowed");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require((_ownerOf[tokenId]) != address(0), "PinkyPromise: tokenId not assigned");
        return promiseMetadataURI(_promiseIdsByTokenId[tokenId]);
    }

    // PinkyPromise implementation
    // ===========================

    function promiseMetadataURI(uint256 promiseId) public view returns (string memory) {
        Promise storage promise_ = _promises[promiseId];
        string memory name = promise_.data.title;
        string memory image = promiseImageURI(promiseId);
        string memory description = "";
        string memory external_url = string.concat("https://pp/promise/", promiseId.toString());
        string memory background_color = PinkyPromiseSvg.promiseContentColor(promise_.data.color);
        string memory flavor = PinkyPromiseSvg.promiseColorName(promise_.data.color);
        return string.concat(
            "data:application/json;base64,",
            Base64.encode(
                bytes(
                    string.concat(
                        "{",
                        '"name":"',
                        name,
                        '", "description":"',
                        description,
                        '", "image":"',
                        image,
                        '", "external_url":"',
                        external_url,
                        '", "background_color":"',
                        background_color,
                        '", "attributes": [{ "trait_type": "Flavor", "value": "',
                        flavor,
                        '" }]',
                        "}"
                    )
                )
            )
        );
    }

    function promiseImageURI(uint256 promiseId) public view returns (string memory) {
        return string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(promiseAsSvg(promiseId))));
    }

    function setEnsRegistry(address ensRegistry) public onlyOwner {
        _ensRegistry = ensRegistry;
    }

    function setBpbDateTime(address bpbDateTime) public onlyOwner {
        _bpbDateTime = bpbDateTime;
    }

    function total() public view returns (uint256) {
        return _latestPromiseId;
    }

    // Get the promise state, based on promise.signees and promise.state
    function _promiseState(Promise storage promise_) private view returns (PromiseState) {
        // signees cannot be empty except when the promise does not exist (default value)
        if (promise_.signees.length == 0) {
            return PromiseState.None;
        }
        if (promise_.state < promise_.signees.length) {
            return PromiseState.Draft;
        }
        if (promise_.state < promise_.signees.length * 2) {
            return PromiseState.Final;
        }
        if (promise_.state == promise_.signees.length * 2 + 1) {
            return PromiseState.Discarded;
        }
        return PromiseState.Nullified;
    }

    // Create a new promise
    function newPromise(PromiseData calldata promiseData, address[] calldata signees)
        external
        returns (uint256 promiseId)
    {
        require(signees.length > 0, "PinkyPromise: a promise requires at least one signee");

        promiseId = ++_latestPromiseId;

        Promise storage promise_ = _promises[promiseId];

        // Populate the signing states
        for (uint256 i = 0; i < signees.length; i++) {
            require(
                _signingStates[promiseId][signees[i]] == SigningState.None, "PinkyPromise: each signee must be unique"
            );

            // Sign if the sender is one of the promise signees
            if (signees[i] == msg.sender) {
                promise_.state++;
                _signingStates[promiseId][msg.sender] = SigningState.Signed;
                emit AddSignature(promiseId, msg.sender);
            } else {
                _signingStates[promiseId][signees[i]] = SigningState.Pending;
            }

            // Used to retreive the promises where a given account is participating
            _promiseIdsBySignee[signees[i]].push(promiseId);
        }

        promise_.data = promiseData;

        if (promise_.data.height < 800) {
            promise_.data.height = 800;
        }

        promise_.signees = signees;

        emit PromiseUpdate(promiseId, PromiseState.Draft);

        // If msg.sender is the sole signer, finalize the promise
        if (_promiseState(promise_) == PromiseState.Final) {
            promise_.tokenIds = new uint256[](1);
            promise_.tokenIds[0] = _mintPromiseNft(promiseId, msg.sender);
            promise_.signedOn = block.timestamp;
            emit PromiseUpdate(promiseId, PromiseState.Final);
        }
    }

    // Mint a single promise NFT
    function _mintPromiseNft(uint256 promiseId, address signee) private returns (uint256) {
        uint256 tokenId = ++_latestTokenId;
        _mint(signee, tokenId);
        _promiseIdsByTokenId[tokenId] = promiseId;
        emit Locked(tokenId);
        return tokenId;
    }

    // Discard a promise. This is only possible when the promise is
    // a draft, and it can get called by any of the signees.
    function discard(uint256 promiseId) external {
        Promise storage promise_ = _promises[promiseId];

        require(_promiseState(promise_) == PromiseState.Draft, "PinkyPromise: only drafts can get discarded");
        require(
            _signingStates[promiseId][msg.sender] != SigningState.None,
            "PinkyPromise: drafts can only get discarded by signees"
        );

        // discarded state, see Promise.state
        promise_.state = promise_.signees.length * 2 + 1;
        emit PromiseUpdate(promiseId, PromiseState.Discarded);
    }

    // Add a signature to a draft. Reverts if the signee has signed already.
    function sign(uint256 promiseId) external {
        Promise storage promise_ = _promises[promiseId];

        require(
            _promiseState(promise_) == PromiseState.Draft,
            "PinkyPromise: only non-discarded drafts can receive signatures"
        );
        require(
            _signingStates[promiseId][msg.sender] != SigningState.None,
            "PinkyPromise: drafts can only get signed by signees"
        );
        require(_signingStates[promiseId][msg.sender] == SigningState.Pending, "PinkyPromise: already signed");

        promise_.state++;
        _signingStates[promiseId][msg.sender] = SigningState.Signed;
        emit AddSignature(promiseId, msg.sender);

        // Last signer creates the NFTs
        if (_promiseState(promise_) == PromiseState.Final) {
            promise_.tokenIds = new uint256[](promise_.signees.length);
            for (uint256 i = 0; i < promise_.signees.length; i++) {
                promise_.tokenIds[i] = _mintPromiseNft(promiseId, promise_.signees[i]);
            }
            promise_.signedOn = block.timestamp;
            emit PromiseUpdate(promiseId, PromiseState.Final);
        }
    }

    // Request to nullify a draft. Once all the signees have requested to
    // nullify, the promise becomes nullified. This is only possible when the
    // promise has been signed by all signees. Reverts if the signee has
    // requested to nullify already.
    function nullify(uint256 promiseId) external {
        Promise storage promise_ = _promises[promiseId];

        require(_promiseState(promise_) == PromiseState.Final, "PinkyPromise: only signed promises can get nullified");
        require(
            _signingStates[promiseId][msg.sender] == SigningState.Signed, "PinkyPromise: invalid nullification request"
        );

        _signingStates[promiseId][msg.sender] = SigningState.NullRequest;

        promise_.state++;
        emit NullifyRequest(promiseId, msg.sender);

        if (_promiseState(promise_) == PromiseState.Nullified) {
            for (uint256 i = 0; i < promise_.tokenIds.length; i++) {
                _burn(promise_.tokenIds[i]);
            }
            emit PromiseUpdate(promiseId, PromiseState.Nullified);
        }
    }

    // Cancel a single nullification request. This is so that signees having requested a
    // nullification can change their mind before the others do it as well.
    function cancelNullify(uint256 promiseId) external {
        Promise storage promise_ = _promises[promiseId];

        require(_promiseState(promise_) == PromiseState.Final, "PinkyPromise: only signed promises can get nullified");
        require(
            _signingStates[promiseId][msg.sender] == SigningState.NullRequest,
            "PinkyPromise: nullification cancel not needed"
        );

        _signingStates[promiseId][msg.sender] = SigningState.Signed;

        promise_.state--;
        emit CancelNullifyRequest(promiseId, msg.sender);
    }

    // Get the signees of a promise and their corresponding signing statuses.
    function signeesStates(uint256 promiseId)
        public
        view
        returns (address[] memory signees, SigningState[] memory signingStates)
    {
        Promise storage promise_ = _promises[promiseId];
        require(_promiseState(promise_) != PromiseState.None, "PinkyPromise: non existant promise");

        signees = promise_.signees;
        signingStates = new SigningState[](signees.length);
        for (uint256 i = 0; i < signees.length; i++) {
            signingStates[i] = _signingStates[promiseId][signees[i]];
        }
    }

    function signeePromises(address signee) public view returns (uint256[] memory promiseIds) {
        promiseIds = _promiseIdsBySignee[signee];
    }

    function promiseState(uint256 promiseId) public view returns (PromiseState) {
        return _promiseState(_promises[promiseId]);
    }

    function promiseInfo(uint256 promiseId)
        public
        view
        returns (
            PromiseData memory data,
            PromiseState state,
            address[] memory signees,
            SigningState[] memory signingStates,
            uint256 signedOn
        )
    {
        Promise storage promise_ = _promises[promiseId];
        require(_promiseState(promise_) != PromiseState.None, "PinkyPromise: non existant promise");

        data = promise_.data;
        state = _promiseState(promise_);
        signedOn = promise_.signedOn;

        (signees, signingStates) = signeesStates(promiseId);
    }

    // Render the promise as an svg image.
    function promiseAsSvg(uint256 promiseId) public view returns (string memory) {
        Promise storage promise_ = _promises[promiseId];
        require(_promiseState(promise_) != PromiseState.None, "PinkyPromise: non existant promise");

        PinkyPromiseSvg.Contracts memory contracts;
        contracts.ensRegistry = _ensRegistry;
        contracts.bpbDateTime = _bpbDateTime;

        PinkyPromiseSvg.PinkyPromiseSvgData memory svgData;
        svgData.promiseId = promiseId;
        svgData.promiseState = promiseState(promiseId);
        svgData.promiseData = promise_.data;
        svgData.signedOn = promise_.signedOn;
        svgData.signees = promise_.signees;

        SigningState[] memory signingStates;
        (, signingStates) = signeesStates(promiseId);

        return PinkyPromiseSvg.promiseAsSvg(contracts, svgData, signingStates);
    }
}
