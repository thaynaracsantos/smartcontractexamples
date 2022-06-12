require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: `${process.env.INFURA_RINKEBY_URL}`,
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`],
    } 
  }
};