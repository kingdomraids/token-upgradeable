const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const KRS_old = artifacts.require('KDKRSR');
const KRS_new = artifacts.require('KRS')

module.exports = async function (deployer) {
    const existing = await  KRS_old.deployed();
    const instance = await upgradeProxy(existing.address,KRS_new, {deployer} );
    if(instance) {
        console.log("Upgraded.");
        console.table(`Address: ${instance.address}`);
    }
};
