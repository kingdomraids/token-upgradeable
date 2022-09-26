// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract MetricBase is OwnableUpgradeable {

    uint256 public totalAllocation;
    uint256 public remainingAmount;
    uint256 public eachReleaseAmount;
    bool public isFirstRelease;
    uint256 public nextTimeRelease ;
    uint256 public releasePeriod ;
    uint256 public lastTimeRelease;

}