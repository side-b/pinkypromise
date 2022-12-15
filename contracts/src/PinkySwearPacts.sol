// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "base64/base64.sol";
import "solmate/tokens/ERC721.sol";
import "./IERC5192.sol";
import "./PinkySwearPactsSvg.sol";

contract PinkySwearPacts is ERC721, IERC5192 {
    struct PactData {
        PactColor color;
        uint16 height;
        string text;
    }

    struct Pact {
        PactData data;
        address[] signees;
        //
        // Pact.state keeps track of the state of the pact by using a counter:
        //
        //   state <  signees.length         => contract just created
        //   state >= signees.length         => contract signed
        //   state == signees.length * 2     => contract nullified
        //   state == signees.length * 2 + 1 => contract discarded
        //
        // See also state(pactId).
        //
        uint256 state;
    }

    enum PactColor {
        BubbleGum,
        BlueberryCake,
        PlainNoodles,
        TomatoSauce,
        BurntToast
    }

    enum PactState {
        None,
        Draft,
        Final,
        Nullified,
        Discarded
    }

    enum SigningState {
        None, // default state is only used to enforce unique signees, see newPact()
        Pending, // awaiting signature
        Signed,
        NullRequest // nullification requested (implies signed)
    }

    uint256 private _latestPactId; // 0
    uint256 private _latestTokenId; // 0

    mapping(uint256 => Pact) private _pacts;
    mapping(uint256 => uint256) private _pactIdsByTokenId;
    mapping(address => uint256[]) private _pactIdsBySignee;

    // pactId => signer => SigningState
    // We use SigningState rather than a boolean in this mapping,
    // so we can rely on SigningState.None (the default) to ensure that
    // Pact.signees only contain unique signatures (see newPact()).
    mapping(uint256 => mapping(address => SigningState)) private _signingStates;

    // pact state change
    event PactUpdate(uint256 pactId, PactState state);

    // single signature added
    event AddSignature(uint256 pactId, address signer);

    // request to nullify the pact
    event NullifyRequest(uint256 pactId, address signer);
    event CancelNullifyRequest(uint256 pactId, address signer);

    error InvalidPactState();

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function supportsInterface(bytes4 interfaceId) public view override (ERC721) returns (bool) {
        return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        require(_ownerOf[tokenId] != address(0), "PinkySwearPacts: tokenId not assigned");
        return true; // always locked
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return pactURI(_pactIdsByTokenId[tokenId]);
    }

    function pactURI(uint256 pactId) public view returns (string memory) {
        return string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(pactAsSvg(pactId))));
    }

    // Get the pact state, based on pact.signees and pact.state
    function _pactState(Pact storage pact) private view returns (PactState) {
        // signees cannot be empty except when the pact does not exist (default value)
        if (pact.signees.length == 0) {
            return PactState.None;
        }
        if (pact.state < pact.signees.length) {
            return PactState.Draft;
        }
        if (pact.state < pact.signees.length * 2) {
            return PactState.Final;
        }
        if (pact.state == pact.signees.length * 2 + 1) {
            return PactState.Discarded;
        }
        return PactState.Nullified;
    }

    // Create a new pact
    function newPact(PactData calldata pactData, address[] calldata signees) external returns (uint256 pactId) {
        require(signees.length > 0, "PinkySwearPacts: a pact requires at least one signee");

        pactId = ++_latestPactId;

        Pact storage pact = _pacts[pactId];

        // Populate the signing states
        for (uint256 i = 0; i < signees.length; i++) {
            require(
                _signingStates[pactId][signees[i]] == SigningState.None, "PinkySwearPacts: each signee must be unique"
            );

            // Sign if the sender is one of the pact signees
            if (signees[i] == msg.sender) {
                pact.state++;
                _signingStates[pactId][msg.sender] = SigningState.Signed;
                emit AddSignature(pactId, msg.sender);
            } else {
                _signingStates[pactId][signees[i]] = SigningState.Pending;
            }

            // Used to retreive the pacts where a given account is participating
            _pactIdsBySignee[signees[i]].push(pactId);
        }

        pact.data = pactData;
        pact.signees = signees;

        emit PactUpdate(pactId, PactState.Draft);

        // If msg.sender is the sole signer, finalize the pact
        if (_pactState(pact) == PactState.Final) {
            _mintPactNft(pactId, msg.sender);
            emit PactUpdate(pactId, PactState.Final);
        }
    }

    // Mint a single pact NFT
    function _mintPactNft(uint256 pactId, address signee) private {
        uint256 tokenId = ++_latestTokenId;
        _mint(signee, tokenId);
        _pactIdsByTokenId[tokenId] = pactId;
        emit Locked(tokenId);
    }

    // Discard a pact. This is only possible when the pact is
    // a draft, and it can get called by any of the signees.
    function discard(uint256 pactId) external {
        Pact storage pact = _pacts[pactId];

        require(_pactState(pact) == PactState.Draft, "PinkySwearPacts: only drafts can get discarded");
        require(
            _signingStates[pactId][msg.sender] != SigningState.None,
            "PinkySwearPacts: drafts can only get discarded by signees"
        );

        // discarded state, see Pact.state
        pact.state = pact.signees.length * 2 + 1;
        emit PactUpdate(pactId, PactState.Discarded);
    }

    // Add a signature to a draft. Reverts if the signee has signed already.
    function sign(uint256 pactId) external {
        Pact storage pact = _pacts[pactId];

        require(
            _pactState(pact) == PactState.Draft, "PinkySwearPacts: only non-discarded drafts can receive signatures"
        );
        require(
            _signingStates[pactId][msg.sender] != SigningState.None,
            "PinkySwearPacts: drafts can only get signed by signees"
        );
        require(_signingStates[pactId][msg.sender] == SigningState.Pending, "PinkySwearPacts: already signed");

        pact.state++;
        _signingStates[pactId][msg.sender] = SigningState.Signed;
        emit AddSignature(pactId, msg.sender);

        // Last signer creates the NFTs
        if (_pactState(pact) == PactState.Final) {
            for (uint256 i = 0; i < pact.signees.length; i++) {
                _mintPactNft(pactId, pact.signees[i]);
            }
            emit PactUpdate(pactId, PactState.Final);
        }
    }

    // Request to nullify a draft. Once all the signees have requested to
    // nullify, the pact becomes nullified. This is only possible when the pact
    // has been signed by all signees. Reverts if the signee has requested to
    // nullify already.
    function nullify(uint256 pactId) external {
        Pact storage pact = _pacts[pactId];

        require(_pactState(pact) == PactState.Final, "PinkySwearPacts: only signed pacts can get nullified");
        require(
            _signingStates[pactId][msg.sender] == SigningState.Signed, "PinkySwearPacts: invalid nullification request"
        );

        _signingStates[pactId][msg.sender] = SigningState.NullRequest;

        pact.state++;
        emit NullifyRequest(pactId, msg.sender);

        if (_pactState(pact) == PactState.Nullified) {
            emit PactUpdate(pactId, PactState.Nullified);
        }
    }

    // Cancel a single nullification request. This is so that signees having requested a
    // nullification can change their mind before the others do it as well.
    function cancelNullify(uint256 pactId) external {
        Pact storage pact = _pacts[pactId];

        require(_pactState(pact) == PactState.Final, "PinkySwearPacts: only signed pacts can get nullified");
        require(
            _signingStates[pactId][msg.sender] == SigningState.NullRequest,
            "PinkySwearPacts: nullification cancel not needed"
        );

        _signingStates[pactId][msg.sender] = SigningState.Signed;

        pact.state--;
        emit CancelNullifyRequest(pactId, msg.sender);
    }

    // Get the signees of a pact and their corresponding signing statuses.
    function signeesStates(uint256 pactId)
        public
        view
        returns (address[] memory signees, SigningState[] memory signingStates)
    {
        Pact storage pact = _pacts[pactId];
        require(_pactState(pact) != PactState.None, "PinkySwearPacts: non existant pact");

        signees = pact.signees;
        signingStates = new SigningState[](signees.length);
        for (uint256 i = 0; i < signees.length; i++) {
            signingStates[i] = _signingStates[pactId][signees[i]];
        }
    }

    function signeePacts(address signee) public view returns (uint256[] memory pactIds) {
        pactIds = _pactIdsBySignee[signee];
    }

    function pactState(uint256 pactId) public view returns (PactState) {
        return _pactState(_pacts[pactId]);
    }

    function pactInfo(uint256 pactId)
        public
        view
        returns (PactData memory data, PactState state, address[] memory signees, SigningState[] memory signingStates)
    {
        Pact storage pact = _pacts[pactId];
        require(_pactState(pact) != PactState.None, "PinkySwearPacts: non existant pact");

        data = pact.data;
        state = _pactState(pact);

        (signees, signingStates) = signeesStates(pactId);
    }

    // Render the pact as an svg image.
    function pactAsSvg(uint256 pactId) public view returns (string memory) {
        Pact storage pact = _pacts[pactId];
        require(_pactState(pact) != PactState.None, "PinkySwearPacts: non existant pact");

        (address[] memory signees, SigningState[] memory signingStates) = signeesStates(pactId);

        return PinkySwearPactsSvg.pactSvgWrapper(
            pact.data.height,
            PinkySwearPactsSvg.pactTextToHtml(pact.data.text),
            PinkySwearPactsSvg.pactSignersToHtml(signees, signingStates)
        );
    }
}
