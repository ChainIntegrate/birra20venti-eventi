require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
  version: "0.8.28",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    viaIR: true,
  },
},
    networks: {
  luksoTestnet: {
    url: "https://rpc.testnet.lukso.network",
    chainId: 4201,
    accounts: [process.env.PRIVATE_KEY.replace('0x', '')],
  },
  luksoMainnet: {
    url: "https://rpc.mainnet.lukso.network",
    chainId: 42,
    accounts: [process.env.PRIVATE_KEY.replace('0x', '')],
  },
},
};
