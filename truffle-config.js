require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    testnet: {
      provider: () => new HDWalletProvider(process.env.BSC_TESTNET_PRIVATE_KEY, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(process.env.BSC_MAINNET_PRIVATE_KEY, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  compilers: {
    solc: {
      version: '0.8.4', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          //    runs: 200
        },
        //  evmVersion: "byzantium"
      }
    },
  },
  api_keys: {
    bscscan: process.env.BSC_SCAN_API_KEY
  },
  plugins: ["truffle-plugin-verify"]
};