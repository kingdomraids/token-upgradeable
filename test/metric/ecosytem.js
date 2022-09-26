const { time } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const bnChai = require('bn-chai');
const expect = require('chai')
  .use(bnChai(web3.utils.BN))
  .expect;

const KRS = artifacts.require("KRS");
const EcosystemFund = artifacts.require("EcosystemFund");

contract('EcosystemFund', (accounts) => {
  const remainingAmount = web3.utils.toWei(web3.utils.toBN(250e6));
  let cliffTime = web3.utils.toBN(0);
  let releasePeriod = web3.utils.toBN(30 * 24 * 60 * 60);

  it('checking balance', async () => {
    const advisorEcosystem = await EcosystemFund.deployed();
    const tokenKRS = await KRS.deployed();
    const owner = await tokenKRS.owner.call();

    await tokenKRS.transfer(advisorEcosystem.address, remainingAmount, {from: owner});

    const remaining = await advisorEcosystem.remainingAmount.call();
    expect(remaining).to.eq.BN(remainingAmount);

  });

  it('release', async () => {
    const tokenKRS = await KRS.deployed();
    const advisorEcosystem = await EcosystemFund.deployed();
    const owner = await advisorEcosystem.owner.call();

    await time.increase(cliffTime);

    let count = 0;
    let balance = await advisorEcosystem.balance.call();
    while (balance > 0) {
      count++;

      beforeBalance = await tokenKRS.balanceOf.call(owner);
      await advisorEcosystem.release({ from: owner });
      afterBalance = await tokenKRS.balanceOf.call(owner);

      await time.increase(releasePeriod);
      balance = await advisorEcosystem.balance.call();
      console.log(count, balance.toString(), afterBalance.sub(beforeBalance).toString());
    }

    balance = await advisorEcosystem.balance.call();
    expect(balance).to.eq.BN(web3.utils.toBN(0));
  });
});
