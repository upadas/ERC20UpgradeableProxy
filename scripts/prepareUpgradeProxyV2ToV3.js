const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x6eE935B6B58A428Fd550b9F38D63d9b80E013D35";
  // This is the proxy address NOT the admin of the proxy.

  const ERC20TokenV3 = await ethers.getContractFactory("ERC20TokenV3");
  console.log("Preparing upgrade...");
  const erc20TokenV3 = await upgrades.prepareUpgrade(
    proxyAddress,
    ERC20TokenV3
  );
  console.log("ERC20TokenV3 at:", erc20TokenV3);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// ERC20TokenV3 at: 0xd756b761266645018A32deA796D04aeCF2D49756
//  npx hardhat verify --network goerli 0xd756b761266645018A32deA796D04aeCF2D49756
// Nothing to compile
// Successfully submitted source code for contract
// contracts/ERC20TokenV3.sol:ERC20TokenV3 at 0xd756b761266645018A32deA796D04aeCF2D49756
// for verification on the block explorer. Waiting for verification result...

// Successfully verified contract ERC20TokenV3 on Etherscan.
// https://goerli.etherscan.io/address/0xd756b761266645018A32deA796D04aeCF2D49756#code
