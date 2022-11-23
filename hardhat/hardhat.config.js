require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path:".env"});
const NodeKey=process.env.nodeKey;
const Privatekey=process.env.privatekey;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    "arbitrum-goerli":{
      url: NodeKey,
      accounts:[Privatekey],
    },
  },
};
