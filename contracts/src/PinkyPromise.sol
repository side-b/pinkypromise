// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "base64/base64.sol";
import "solmate/auth/Owned.sol";
import "solmate/tokens/ERC721.sol";
import "solmate/utils/LibString.sol";
import {IERC5192} from "src/interfaces/IERC5192.sol";
import {PinkyPromiseSvg} from "./PinkyPromiseSvg.sol";

/// @title PinkyPromise
/// @author Pierre Bertet
/// @notice A contract to create and sign "promises", which are soulbound NFTs.
/// @dev ERC721 & IERC5192 compliant. The NFT contract is also ownable
contract PinkyPromise is ERC721, IERC5192, Owned {
    using LibString for uint256;

    /*//////////////////////////////////////////////////////////////
                                STATE
    //////////////////////////////////////////////////////////////*/

    /// @notice The latest promise ID.
    /// Note that the promise ID is NOT equivalent to a token ID, as a promise can have many signees,
    /// and each one of them will receive a separate NFT, corresponding to the promise.
    uint256 public latestPromiseId; // 0
    /// @notice The latest token ID.
    uint256 public latestTokenId; // 0

    mapping(uint256 => Promise) public promises;
    /// @notice Mapping of a certain token ID to the promise it's associated with.
    mapping(uint256 => uint256) public promiseIdsByTokenId;
    /// @notice Mapping of a certain signee address to the promises he's associated with.
    mapping(address => uint256[]) public promiseIdsBySignee;

    /// @notice promiseId => signer => SigningState
    /// We use SigningState rather than a boolean in this mapping,
    /// so we can rely on SigningState.None (the default) to ensure that
    /// Promise.signees only contain unique signatures (see newPromise()).
    mapping(uint256 => mapping(address => SigningState)) public signingStatesByPromise;

    /// @notice The ENS registry address.
    address public ensRegistry;

    /// @notice The BPBDateTime library address.
    /// See: https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary
    address public bpbDateTime;

    string networkPrefix;

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
        /// The promise state. This works using a counter,
        /// with several values representing different states:
        /// state <  signees.length         => contract just created
        /// state >= signees.length         => contract signed
        /// state == signees.length * 2     => contract nullified
        /// state == signees.length * 2 + 1 => contract discarded
        ///
        /// See also state(promiseId).
        ///
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

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Indicates if the minting has stopped.
    /// Creation of new promises can be stopped, making it possible to deploy a new version of the contract without ID conflicts.
    bool public stopped = false;

    /// @dev Emits when a promise is updated.
    /// This event is emitted when a promise is created, finalized (all signees have signed), nullified or discarded.
    event PromiseUpdate(uint256 indexed promiseId, PromiseState state);
    /// @dev Emits when a single signature is added
    event AddSignature(uint256 indexed promiseId, address indexed signer);
    /// @dev Emitted when a signee requests to nullify the promise
    event NullifyRequest(uint256 indexed promiseId, address indexed signer);
    /// @dev Emitted when a signe cancels a request to nullify the promise.
    event CancelNullifyRequest(uint256 indexed promiseId, address indexed signer);

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier notStopped() {
        require(!stopped, "PinkyPromise: the contract has been stopped and promises cannot be created anymore");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory networkPrefix_,
        address ensRegistry_,
        address bpbDateTime_
    ) ERC721(name_, symbol_) Owned(msg.sender) {
        networkPrefix = networkPrefix_;
        ensRegistry = ensRegistry_;
        bpbDateTime = bpbDateTime_;
    }

    /*//////////////////////////////////////////////////////////////
                          EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Creates a new promise.
    /// @dev If one of the signees is msg.sender, the promise is automatically signed. Each signee receives an NFT with the promise.
    /// @param promiseData The promise metadata to put in the NFT.
    /// @param signees The signees of the promise.
    /// @return promiseId The promise ID.
    function newPromise(PromiseData calldata promiseData, address[] calldata signees)
        external
        notStopped
        returns (uint256 promiseId)
    {
        require(signees.length > 0, "PinkyPromise: a promise requires at least one signee");

        promiseId = ++latestPromiseId;

        Promise storage promise_ = promises[promiseId];

        // Populate the signing states
        for (uint256 i = 0; i < signees.length; i++) {
            require(
                signingStatesByPromise[promiseId][signees[i]] == SigningState.None,
                "PinkyPromise: each signee must be unique"
            );

            // Sign if the sender is one of the promise signees
            if (signees[i] == msg.sender) {
                promise_.state++;
                signingStatesByPromise[promiseId][msg.sender] = SigningState.Signed;
                emit AddSignature(promiseId, msg.sender);
            } else {
                signingStatesByPromise[promiseId][signees[i]] = SigningState.Pending;
            }

            // Used to retreive the promises where a given account is participating
            promiseIdsBySignee[signees[i]].push(promiseId);
        }

        promise_.data = promiseData;

        if (promise_.data.height < 800) {
            promise_.data.height = 800;
        }

        promise_.signees = signees;

        emit PromiseUpdate(promiseId, PromiseState.Draft);

        // If msg.sender is the sole signer, finalize the promise
        if (_promiseState(promise_) == PromiseState.Final) {
            _finalizeAndMint(promiseId, promise_.signees);
        }
    }

    /// @notice Add a signature to a promise draft.
    /// @dev Reverts if the signee has signed already or if the promise is already discarded or nullified.
    /// @param promiseId The promise ID.
    function sign(uint256 promiseId) external {
        Promise storage promise_ = promises[promiseId];

        require(
            _promiseState(promise_) == PromiseState.Draft,
            "PinkyPromise: only non-discarded drafts can receive signatures"
        );
        require(
            signingStatesByPromise[promiseId][msg.sender] != SigningState.None,
            "PinkyPromise: drafts can only get signed by signees"
        );
        require(signingStatesByPromise[promiseId][msg.sender] == SigningState.Pending, "PinkyPromise: already signed");

        promise_.state++;
        signingStatesByPromise[promiseId][msg.sender] = SigningState.Signed;
        emit AddSignature(promiseId, msg.sender);

        // Last signer creates the NFTs
        // on the above function as well
        if (_promiseState(promise_) == PromiseState.Final) {
            _finalizeAndMint(promiseId, promise_.signees);
        }
    }

    /// @notice Discard a promise.
    /// @dev This is only possible when the promise is a draft, and it can get called by any of the signees.
    /// @param promiseId The promise ID.
    function discard(uint256 promiseId) external {
        Promise storage promise_ = promises[promiseId];

        require(_promiseState(promise_) == PromiseState.Draft, "PinkyPromise: only drafts can get discarded");
        require(
            signingStatesByPromise[promiseId][msg.sender] != SigningState.None,
            "PinkyPromise: drafts can only get discarded by signees"
        );

        // discarded state, see Promise.state
        promise_.state = promise_.signees.length * 2 + 1;
        emit PromiseUpdate(promiseId, PromiseState.Discarded);
    }

    /// @notice Request to nullify a promise. Once all the signees have requested to
    /// nullify, the promise becomes nullified. This is only possible when the
    /// promise has been signed by all signees. Reverts if the signee has
    /// requested to nullify already.
    /// @param promiseId The promise ID.
    function nullify(uint256 promiseId) external {
        Promise storage promise_ = promises[promiseId];

        require(_promiseState(promise_) == PromiseState.Final, "PinkyPromise: only signed promises can get nullified");
        require(
            signingStatesByPromise[promiseId][msg.sender] == SigningState.Signed,
            "PinkyPromise: invalid nullification request"
        );

        signingStatesByPromise[promiseId][msg.sender] = SigningState.NullRequest;

        promise_.state++;
        emit NullifyRequest(promiseId, msg.sender);

        if (_promiseState(promise_) == PromiseState.Nullified) {
            for (uint256 i = 0; i < promise_.tokenIds.length; i++) {
                _burn(promise_.tokenIds[i]);
            }
            emit PromiseUpdate(promiseId, PromiseState.Nullified);
        }
    }

    /// @notice Cancel a single nullification request. This is so that signees having requested a
    /// nullification can change their mind before the others do it as well.
    /// @dev This is only possible if the promise is signed by all signees AND the current signee has tried to nullify the promise.
    function cancelNullify(uint256 promiseId) external {
        Promise storage promise_ = promises[promiseId];

        require(_promiseState(promise_) == PromiseState.Final, "PinkyPromise: only signed promises can get nullified");
        require(
            signingStatesByPromise[promiseId][msg.sender] == SigningState.NullRequest,
            "PinkyPromise: nullification cancel not needed"
        );

        signingStatesByPromise[promiseId][msg.sender] = SigningState.Signed;

        promise_.state--;
        emit CancelNullifyRequest(promiseId, msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                    ERC721/5192 FUNCTION OVERRIDES
    //////////////////////////////////////////////////////////////*/

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
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
        return promiseMetadataURI(promiseIdsByTokenId[tokenId]);
    }

    /// @notice Check if the token is soulbound. In the case of Pinky Promises, they always are..
    function locked(uint256 tokenId) external view returns (bool) {
        require(_ownerOf[tokenId] != address(0), "PinkyPromise: tokenId not assigned");
        return true; // always locked
    }

    /*//////////////////////////////////////////////////////////////
                   PinkyPromise SPECIFIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Compute the metadata URI for a promise.
    /// @param promiseId The promise ID.
    /// @return The metadata URI.
    function promiseMetadataURI(uint256 promiseId) public view returns (string memory) {
        Promise storage promise_ = promises[promiseId];
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

    /// @notice Renders the promise as an SVG.
    /// @dev This uses the PinkyPromiseSvg library to render the promise.
    /// @return The SVG as a string.
    function promiseAsSvg(uint256 promiseId) public view returns (string memory) {
        Promise storage promise_ = promises[promiseId];
        require(_promiseState(promise_) != PromiseState.None, "PinkyPromise: non existant promise");

        PinkyPromiseSvg.Contracts memory contracts;
        contracts.ensRegistry = ensRegistry;
        contracts.bpbDateTime = bpbDateTime;

        PinkyPromiseSvg.PinkyPromiseSvgData memory svgData;
        svgData.networkPrefix = networkPrefix;
        svgData.promiseId = promiseId;
        svgData.promiseState = promiseState(promiseId);
        svgData.promiseData = promise_.data;
        svgData.signedOn = promise_.signedOn;
        svgData.signees = promise_.signees;

        SigningState[] memory signingStates;
        (, signingStates) = promiseSignees(promiseId);

        return PinkyPromiseSvg.promiseAsSvg(contracts, svgData, signingStates);
    }

    /// @notice Renders the promise as an SVG and returns it as a data URI.
    /// @param promiseId The promise ID.
    /// @return The SVG as a data URI.
    function promiseImageURI(uint256 promiseId) public view returns (string memory) {
        return string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(promiseAsSvg(promiseId))));
    }

    /// @notice Get the promise signees and their signing states.
    /// @param promiseId The promise ID.
    /// @return The signees and their signing states.
    function promiseSignees(uint256 promiseId)
        public
        view
        returns (address[] memory signees, SigningState[] memory signingStates)
    {
        Promise storage promise_ = promises[promiseId];
        require(_promiseState(promise_) != PromiseState.None, "PinkyPromise: non existant promise");

        signees = promise_.signees;
        signingStates = new SigningState[](signees.length);
        for (uint256 i = 0; i < signees.length; i++) {
            signingStates[i] = signingStatesByPromise[promiseId][signees[i]];
        }
    }

    /// @notice Get the promises a signee is involved in.
    /// @param signee The signee address.
    /// @return promiseIds The promise IDs.
    function signeePromises(address signee) public view returns (uint256[] memory promiseIds) {
        promiseIds = promiseIdsBySignee[signee];
    }

    /// @notice Get the state of a promise.
    /// @param promiseId The promise ID.
    /// @return The promise state.
    function promiseState(uint256 promiseId) public view returns (PromiseState) {
        return _promiseState(promises[promiseId]);
    }

    /// @notice Get all relevant information about a promise, including its data, state, signees, signing states and signed on date.
    /// @param promiseId The promise ID.
    /// @return All the promise information.
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
        Promise storage promise_ = promises[promiseId];
        require(_promiseState(promise_) != PromiseState.None, "PinkyPromise: non existant promise");

        data = promise_.data;
        state = _promiseState(promise_);
        signedOn = promise_.signedOn;

        (signees, signingStates) = promiseSignees(promiseId);
    }

    /// @notice Get the total number of promises.
    /// @dev This is NOT equal to the amount of NFTs minted.
    /// @return The total number of promises.
    function total() public view returns (uint256) {
        return latestPromiseId;
    }

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function stop() public onlyOwner {
        stopped = true;
    }

    function setEnsRegistry(address ensRegistry_) public onlyOwner {
        ensRegistry = ensRegistry_;
    }

    function setBpbDateTime(address bpbDateTime_) public onlyOwner {
        bpbDateTime = bpbDateTime_;
    }

    /*//////////////////////////////////////////////////////////////
                      INTERNAL/PRIVATE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    // Get the promise state, based on promise.signees and promise.state
    function _promiseState(Promise storage promise_) internal view returns (PromiseState) {
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

    // Mint a single promise NFT
    function _mintPromiseNft(uint256 promiseId, address signee) internal returns (uint256) {
        uint256 tokenId = ++latestTokenId;
        _mint(signee, tokenId);
        promiseIdsByTokenId[tokenId] = promiseId;
        emit Locked(tokenId);
        return tokenId;
    }

    function _finalizeAndMint(uint256 promiseId, address[] storage signees) internal {
        Promise storage promise_ = promises[promiseId];

        promise_.tokenIds = new uint256[](signees.length);
        for (uint256 i = 0; i < signees.length; i++) {
            promise_.tokenIds[i] = _mintPromiseNft(promiseId, signees[i]);
        }

        promise_.signedOn = block.timestamp;

        emit PromiseUpdate(promiseId, PromiseState.Final);
    }
}
