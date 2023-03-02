// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "solmate/utils/LibString.sol";
import {StringPad} from "src/lib/StringPad.sol";

interface BokkyPooBahsDateTimeContract {
    function getYear(uint256 timestamp) external pure returns (uint256 year);
    function getMonth(uint256 timestamp) external pure returns (uint256 month);
    function getDay(uint256 timestamp) external pure returns (uint256 day);
}

library DateUtils {
    using LibString for uint256;
    using StringPad for string;

    function formatDate(address bpbDateTimeAddress, uint256 timestamp)
        public
        view
        returns (string memory formattedDate)
    {
        if (bpbDateTimeAddress.code.length == 0) {
            return "";
        }

        BokkyPooBahsDateTimeContract bpbDateTime = BokkyPooBahsDateTimeContract(bpbDateTimeAddress);

        try bpbDateTime.getYear(timestamp) returns (uint256 year) {
            formattedDate = year.toString();
        } catch {
            return "";
        }

        try bpbDateTime.getMonth(timestamp) returns (uint256 month) {
            formattedDate = string.concat(formattedDate, ".", month.toString().padStart(2, "0"));
        } catch {
            return "";
        }

        try bpbDateTime.getDay(timestamp) returns (uint256 day) {
            return string.concat(formattedDate, ".", day.toString().padStart(2, "0"));
        } catch {
            return "";
        }
    }
}
