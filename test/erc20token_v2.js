const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { expectRevert } = require("@openzeppelin/test-helpers");

let tokenV2;
let deployer, user1;
const tokenName = "ERC20 Token";
const tokenSymbol = "TKN";
const amount = 1000000;

describe("ERC20TokenV2 Test", () => {
  before(async () => {
    const ERC20TokenV2 = await ethers.getContractFactory("ERC20TokenV2");
    tokenV2 = await upgrades.deployProxy(ERC20TokenV2, [amount]);
    await tokenV2.deployed();

    // const implementationAddress =
    // await upgrades.erc1967.getImplementationAddress(tokenV2.address);

    const account = await ethers.getSigners();
    deployer = account[0];
    user1 = account[1];
  });

  describe("Phase 1: ERC20 contract with a pre-minting of 1 million tokens", () => {
    it("1. Token should have name", async () => {
      const name = await tokenV2.name();
      expect(name).to.be.equal(tokenName);
    });

    it("2. Token should have symbol", async () => {
      const symbol = await tokenV2.symbol();
      expect(symbol).to.be.equal(tokenSymbol);
    });

    it("3. Token should have 1 million tokens", async () => {
      const totalSupply = await tokenV2.totalSupply();
      expect(totalSupply.toString()).to.be.equal(amount.toString());
    });

    it("4. Deployer should have balance of 10000 tokens", async () => {
      const balance = await tokenV2.balanceOf(deployer.address);
      expect(balance.toString()).to.be.equal(amount.toString());
    });

    it("5. Deployer should be token owner", async () => {
      const owner = await tokenV2.owner();
      expect(owner).to.be.equal(deployer.address);
    });
  });

  describe("Phase 2: Testing mint(), burn(), allowance() functionalities", () => {
    it("8. Only owner should be able to mint the token", async () => {
      const amount2 = 5000;
      const beforeTotalSupply = await tokenV2.totalSupply();
      const beforeBalance = await tokenV2.balanceOf(deployer.address);

      const tx = await tokenV2
        .connect(deployer)
        .mint(deployer.address, amount2);

      await tx.wait();

      const afterTotalSupply = await tokenV2.totalSupply();
      console.log(afterTotalSupply);
      // expect(afterTotalSupply).to.be.greaterThan(beforeTotalSupply);
      const afterBalance = await tokenV2.balanceOf(deployer.address);
      console.log(afterBalance);
      // expect(afteBalance).to.be.greaterThan(beforeBalance);
    });

    it("9. User1 should not be able to mint the token", async () => {
      const amount2 = 5000;

      // await tokenV2.connect(user1).mint(user1.address, amount2);

      await expect(tokenV2.connect(user1).mint(user1.address, amount2)).to.be
        .reverted;
    });

    // it("10. User1 should not be able to burn the token", async () => {
    //   const amount2 = 5000;
    //   await expect(tokenV2.connect(user1).burn(user1.address, amount2)).to.be
    //     .reverted;
    // });

    // it("9. Only owner should be able to burn the token", async () => {
    //   const amount2 = 5000;
    //   const beforeTotalSupply = await tokenV2.totalSupply();
    //   const beforeBalance = await tokenV2.balanceOf(deployer.address);

    //   const tx = await tokenV2
    //     .connect(deployer)
    //     .burn(deployer.address, amount2);

    //   await tx.wait();

    //   const afterTotalSupply = await tokenV2.totalSupply();
    //   console.log(afterTotalSupply);
    //   // expect(afterTotalSupply).to.be.greaterThan(beforeTotalSupply);
    //   const afterBalance = await tokenV2.balanceOf(deployer.address);
    //   console.log(afterBalance);
    //   // expect(afteBalance).to.be.greaterThan(beforeBalance);
    // });
  });
});
