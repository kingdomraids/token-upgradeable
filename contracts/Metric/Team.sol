// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import './MetricBase.sol';

contract Team is MetricBase {

    using SafeERC20Upgradeable for IERC20Upgradeable;
    IERC20Upgradeable public token;

    function initialize(address _token) public initializer {
        __Ownable_init();
        token = IERC20Upgradeable(_token);
        totalAllocation = 140e6 * 1e18; // 140.000.000
        remainingAmount = 140e6 * 1e18; // 140.000.000
        eachReleaseAmount = totalAllocation / 24; // unlock very months vesting over 24 months
        nextTimeRelease = block.timestamp + 360 days; // 12 months cliff
        releasePeriod = 30 days;
        lastTimeRelease = block.timestamp + 1080 days ; // vesting over 24 months
    }

    event ReleaseAllocation(
        address indexed to,
        uint256 releaseAmount,
        uint256 remainingAmount
    );

    function balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function release() external onlyOwner {
        require(remainingAmount > 0, "All tokens were released");
        require(
            block.timestamp >= nextTimeRelease,
            "Please wait until release time"
        );
        uint256 amount = 0;
        if (block.timestamp >= lastTimeRelease) {
            amount = remainingAmount;
        } else {
            if (eachReleaseAmount <= remainingAmount) {
                amount = eachReleaseAmount;
            } else {
                amount = remainingAmount;
            }
        }
        remainingAmount = remainingAmount - amount;
        nextTimeRelease = nextTimeRelease + releasePeriod;
        token.safeTransfer(msg.sender, amount);
        emit ReleaseAllocation(msg.sender, amount, remainingAmount);
    }
}
