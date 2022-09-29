const { time } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const bnChai = require('bn-chai');
const expect = require('chai')
  .use(bnChai(web3.utils.BN))
  .expect;

const KRS = artifacts.require("KRS");
const Marketing = artifacts.require("Marketing");

contract('Marketing', (accounts) => {
  const remainingAmount = web3.utils.toWei(web3.utils.toBN(100000000));
  let cliffTime = web3.utils.toBN(0);
  let releasePeriod = web3.utils.toBN( 30 * 24 * 60 * 60);

  it('checking balance', async () => {
    const marketingMetric = await Marketing.deployed();
    const tokenKRS = await KRS.deployed();
    const owner = await tokenKRS.owner.call();

    await tokenKRS.transfer(marketingMetric.address, remainingAmount, {from: owner});

    const remaining = await marketingMetric.remainingAmount.call();
    expect(remaining).to.eq.BN(remainingAmount);

  });

  it('release', async () => {
    const tokenKRS = await KRS.deployed();
    const marketingMetric = await Marketing.deployed();
    const owner = await marketingMetric.owner.call();

    await time.increase(cliffTime);

    let count = 0;
    let balance = await marketingMetric.balance.call();
    while (balance > 0) {
      count++;

      beforeBalance = await tokenKRS.balanceOf.call(owner);
      await marketingMetric.release({ from: owner });
      afterBalance = await tokenKRS.balanceOf.call(owner);

      await time.increase(releasePeriod);
      balance = await marketingMetric.balance.call();
      console.log(count, balance.toString(), afterBalance.sub(beforeBalance).toString());
    }

    balance = await marketingMetric.balance.call();
    expect(balance).to.eq.BN(web3.utils.toBN(0));
  });
});
