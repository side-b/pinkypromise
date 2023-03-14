// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AddressUtils} from "./AddressUtils.sol";

interface IENS {
    function resolver(bytes32 node) external view returns (address);
}

interface IENSReverseResolver {
    function name(bytes32 node) external view returns (string memory name);
}

library EnsUtils {
    using AddressUtils for address;

    function nameOrAddress(address registry, address address_) internal view returns (string memory) {
        if (registry.code.length == 0) {
            return address_.toString();
        }

        bytes32 node = reverseResolveNameHash(address_);

        address resolverAddress;
        try IENS(registry).resolver(node) returns (address resolverAddress_) {
            if (resolverAddress_.code.length == 0) {
                return address_.toString();
            }
            resolverAddress = resolverAddress_;
        } catch {
            return address_.toString();
        }

        try IENSReverseResolver(resolverAddress).name(node) returns (string memory name) {
            return name;
        } catch {
            return address_.toString();
        }
    }

    function reverseResolveNameHash(address address_) internal pure returns (bytes32 namehash) {
        namehash = keccak256(abi.encodePacked(namehash, keccak256(abi.encodePacked("reverse"))));
        namehash = keccak256(abi.encodePacked(namehash, keccak256(abi.encodePacked("addr"))));
        namehash = keccak256(abi.encodePacked(namehash, keccak256(abi.encodePacked(address_.toStringNoPrefix()))));
    }
}
