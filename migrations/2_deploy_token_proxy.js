const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const KRS = artifacts.require("KRS");
const knownContracts = require('./known-contracts')

module.exports = async function (deployer) {
    if ('bsc' === deployer.network || 'testnet' === deployer.network) {
        const address = knownContracts[network];
        console.table(`Address: ${address.krs}`)
    }else{
        const instance = await deployProxy(KRS);
        if(instance) {
            console.log("KRS successfully deployed.");
            console.table(`Address: ${instance.address}`);
        }
    }

}
