const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

let tokenV1;
let deployer;
const tokenName = "ERC20 Token";
const tokenSymbol = "TKN";

const amountToEther = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};
const amount = amountToEther(1000000);

describe("ERC20TokenV1 Test", () => {
  before(async () => {
    const ERC20TokenV1 = await ethers.getContractFactory("ERC20TokenV1");
    tokenV1 = await upgrades.deployProxy(ERC20TokenV1, [amount]);

    await tokenV1.deployed();

    const account = await ethers.getSigners();
    deployer = account[0];
  });

  describe("Phase 1: ERC20 contract with a pre-minting of 1 million tokens", () => {
    it("1. Token should have name", async () => {
      const name = await tokenV1.name();
      expect(name).to.be.equal(tokenName);
    });

    it("2. Token should have symbol", async () => {
      const symbol = await tokenV1.symbol();
      expect(symbol).to.be.equal(tokenSymbol);
    });

    it("3. Token should have 1 million tokens", async () => {
      const totalSupply = await tokenV1.totalSupply();
      expect(totalSupply.toString()).to.be.equal(amount.toString());
    });

    it("4. Deployer should have balance of 10000 tokens", async () => {
      const balance = await tokenV1.balanceOf(deployer.address);
      expect(balance.toString()).to.be.equal(amount.toString());
    });

    it("5. Deployer should be token owner", async () => {
      const owner = await tokenV1.owner();
      expect(owner).to.be.equal(deployer.address);
    });
  });
});
