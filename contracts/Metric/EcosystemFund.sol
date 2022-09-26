// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import './MetricBase.sol';

contract EcosystemFund is MetricBase {

    using SafeERC20Upgradeable for IERC20Upgradeable;
    IERC20Upgradeable public token;

    function initialize(address _token) public initializer {
        __Ownable_init();
        token = IERC20Upgradeable(_token);
        totalAllocation = 250e6 * 1e18; // 250.000.000
        remainingAmount = 250e6 * 1e18; // 250.000.000
        eachReleaseAmount = totalAllocation / 60 ; // with monthly vesting over 5 years
        nextTimeRelease = block.timestamp; // Unlock after game launching
        releasePeriod = 30 days;
        lastTimeRelease = block.timestamp + 1800 days ; // over 5 years
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
