// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import './MetricBase.sol';

contract Liquidity is MetricBase {

    using SafeERC20Upgradeable for IERC20Upgradeable;
    IERC20Upgradeable public token;

    function initialize(address _token) public initializer {
        __Ownable_init();
        token = IERC20Upgradeable(_token);
        totalAllocation = 141428571 * 1e18; // 141.428.571
        remainingAmount = 141428571 * 1e18; // 141.428.571
        eachReleaseAmount = 7e6 * 1e18; // unlock every 3 months vesting over 24 months
        isFirstRelease = true;
        nextTimeRelease = block.timestamp;
        releasePeriod = 90 days;
        lastTimeRelease = block.timestamp + 1860 days;
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
        if(isFirstRelease) {
            uint256 amount = 0;
            isFirstRelease = false;
            amount = 1428571 * 1e18;
            remainingAmount = remainingAmount - amount;
            nextTimeRelease = nextTimeRelease + 60 days; // 2 months cliff
            token.safeTransfer(msg.sender, amount);
            emit ReleaseAllocation(msg.sender, amount, remainingAmount);
        }else{
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
}
