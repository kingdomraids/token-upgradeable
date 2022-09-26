const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const knownContracts = require('./known-contracts');
const KRS = artifacts.require("KRS");
const Advisor = artifacts.require("Advisor");
const Liquidity = artifacts.require("Liquidity");
const EcosystemFund = artifacts.require("EcosystemFund");
const Team = artifacts.require("Team");
const Marketing = artifacts.require("Marketing");

module.exports = async function (deployer) {
    let factory;
    if ('bsc' === deployer.network || 'testnet' === deployer.network) {
        const address = knownContracts[network];
        factory = address.krs;
        console.table(`Address: ${address.krs}`)
    }else{
        const contract = await KRS.deployed();
        factory = contract.address
        console.table(`Address: ${contract.address}`)
    }
    const advisor = await deployProxy(Advisor,[factory],{deployer});
    if(advisor) {
        console.log("Advisor successfully deployed.");
        console.table(`Address: ${advisor.address}`);
    }
    const liquidity = await deployProxy(Liquidity,[factory],{deployer});
    if(liquidity) {
        console.log("Liquidity successfully deployed.");
        console.table(`Address: ${liquidity.address}`);
    }
    const ecosystem_fund = await deployProxy(EcosystemFund,[factory],{deployer});
    if(ecosystem_fund) {
        console.log("EcosystemFund successfully deployed.");
        console.table(`Address: ${ecosystem_fund.address}`);
    }
    const team = await deployProxy(Team,[factory],{deployer});
    if(team) {
        console.log("Team successfully deployed.");
        console.table(`Address: ${team.address}`);
    }
    const marketing = await deployProxy(Marketing,[factory],{deployer});
    if(marketing) {
        console.log("Marketing successfully deployed.");
        console.table(`Address: ${marketing.address}`);
    }
}