// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "base64/base64.sol";
import "solmate/tokens/ERC721.sol";
import "./IERC5192.sol";
import "./PinkySwearPactsSvg.sol";

contract PinkySwearPacts is ERC721, IERC5192 {
    struct Pact {
        string text;
        uint16 imageHeight;
        address[] signees;
        // Keep track of the current state of the pact:
        //   state <  signees.length         => contract just created
        //   state >= signees.length         => contract signed
        //   state == signees.length * 2     => contract nullified
        //   state == signees.length * 2 + 1 => contract discarded
        // See also state(pactId)
        uint256 state;
    }

    enum PactState {
        None,
        Draft,
        Final,
        Nullified,
        Discarded
    }

    enum SigningState {
        None, // default state, only used to require unique signees
        Pending, // awaiting signature
        Signed,
        NullRequest // nullification requested (implies signed)
    }

    uint256 private _latestPactId; // 0
    uint256 private _latestTokenId; // 0

    mapping(uint256 => Pact) private _pacts;
    mapping(uint256 => uint256) private _pactIdsByTokenId;

    // pactId => signer => SigningState
    // We use SigningState rather than a boolean in this mapping,
    // so we can rely on SigningState.None (the default) to ensure that
    // Pact.signees only contain unique signatures.
    mapping(uint256 => mapping(address => SigningState)) private _signingStates;

    // pact state change
    event PactUpdate(uint256 pactId, PactState state);

    // single signature added
    event AddSignature(uint256 pactId, address signer);

    // request to nullify the pact
    event NullifyRequest(uint256 pactId, address signer);
    event CancelNullifyRequest(uint256 pactId, address signer);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function supportsInterface(bytes4 interfaceId) public view override (ERC721) returns (bool) {
        return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        uint256 pactId = _pactIdsByTokenId[tokenId];
        return string.concat("data:image/svg+xml;base64,", Base64.encode(bytes(pactAsSvg(pactId))));
    }

    function locked(uint256 tokenId) external view returns (bool) {
        require(_ownerOf[tokenId] != address(0), "PinkySwearPacts: tokenId not assigned");
        return true; // always locked
    }

    // Get the pact state, based on pact.signees and pact.state
    function _state(Pact storage pact) private view returns (PactState) {
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

    function state(uint256 pactId) public view returns (PactState) {
        return _state(_pacts[pactId]);
    }

    // Create a new pact
    function newPact(address[] calldata signees, string calldata text, uint16 imageHeight)
        external
        returns (uint256 pactId)
    {
        require(signees.length > 0, "PinkySwearPacts: a pact requires at least one signer");

        pactId = ++_latestPactId;

        Pact storage pact = _pacts[pactId];
        pact.text = text;
        pact.imageHeight = imageHeight;

        emit PactUpdate(pactId, PactState.Draft);

        // Mint one NFT for each signer
        for (uint256 i = 0; i < signees.length; i++) {
            // Ensure unique signees
            if (_signingStates[pactId][signees[i]] != SigningState.None) {
                continue;
            }

            pact.signees.push(signees[i]);

            // Sign if the sender is one of the pact signees
            if (signees[i] == msg.sender) {
                _signingStates[pactId][msg.sender] = SigningState.Signed;
                pact.state++;
                emit AddSignature(pactId, msg.sender);
            } else {
                _signingStates[pactId][signees[i]] = SigningState.Pending;
            }
        }

        // Only happens if msg.sender is the only signer
        if (_state(pact) == PactState.Final) {
            _mintPactNft(pactId, pact.signees[0]);
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

        require(_state(pact) == PactState.Draft, "PinkySwearPacts: only drafts can get discarded");
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

        require(_state(pact) == PactState.Draft, "PinkySwearPacts: only non-discarded drafts can receive signatures");
        require(
            _signingStates[pactId][msg.sender] != SigningState.None,
            "PinkySwearPacts: drafts can only get signed by signees"
        );
        require(_signingStates[pactId][msg.sender] == SigningState.Pending, "PinkySwearPacts: already signed");

        _signingStates[pactId][msg.sender] = SigningState.Signed;

        pact.state++;
        emit AddSignature(pactId, msg.sender);

        // Last signer creates the NFTs
        if (_state(pact) == PactState.Final) {
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

        require(_state(pact) == PactState.Final, "PinkySwearPacts: only signed pacts can get nullified");
        require(
            _signingStates[pactId][msg.sender] == SigningState.Signed,
            "PinkySwearPacts: nullification already requested"
        );

        _signingStates[pactId][msg.sender] = SigningState.NullRequest;

        pact.state++;
        emit NullifyRequest(pactId, msg.sender);

        if (_state(pact) == PactState.Nullified) {
            emit PactUpdate(pactId, PactState.Nullified);
        }
    }

    // Cancel a single nullification request. This is so that signees having requested a
    // nullification can change their mind before the others do it as well.
    function cancelNullify(uint256 pactId) external {
        Pact storage pact = _pacts[pactId];

        require(_state(pact) == PactState.Final, "PinkySwearPacts: only signed pacts can get nullified");
        require(
            _signingStates[pactId][msg.sender] == SigningState.NullRequest,
            "PinkySwearPacts: nullification cancel not needed"
        );

        _signingStates[pactId][msg.sender] = SigningState.Signed;

        pact.state--;
        emit CancelNullifyRequest(pactId, msg.sender);
    }

    // Get the signees and their corresponding signing statuses.
    function signeesStates(uint256 pactId)
        public
        view
        returns (address[] memory signees, SigningState[] memory signingStates)
    {
        Pact storage pact = _pacts[pactId];
        require(_state(pact) != PactState.None, "PinkySwearPacts: non existant pact");

        signees = pact.signees;
        signingStates = new SigningState[](signees.length);
        for (uint256 i = 0; i < signees.length; i++) {
            signingStates[i] = _signingStates[pactId][signees[i]];
        }
    }

    // Render the pact as an svg image.
    function pactAsSvg(uint256 pactId) public view returns (string memory) {
        Pact storage pact = _pacts[pactId];
        require(_state(pact) != PactState.None, "PinkySwearPacts: non existant pact");

        (address[] memory signees, SigningState[] memory signingStates) = signeesStates(pactId);

        return PinkySwearPactsSvg.pactSvgWrapper(
            pact.imageHeight,
            PinkySwearPactsSvg.pactTextToHtml(pact.text),
            PinkySwearPactsSvg.pactSignersToHtml(signees, signingStates)
        );
    }
}
