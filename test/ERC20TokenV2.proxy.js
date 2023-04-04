const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

let tokenV2;
let deployer, user1;
const tokenName = "ERC20 Token";
const tokenSymbol = "TKN";

const amountToEther = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};
const amount = amountToEther(1000000);

describe("ERC20TokenV2 Proxy Test", () => {
  before(async () => {
    const TokenV1 = await ethers.getContractFactory("ERC20TokenV1");
    const TokenV2 = await ethers.getContractFactory("ERC20TokenV2");
    const tokenV1 = await upgrades.deployProxy(TokenV1, [amount]);
    tokenV2 = await upgrades.upgradeProxy(tokenV1.address, TokenV2);

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
      const amount2 = amountToEther(5000);
      const beforeTotalSupply = await tokenV2.totalSupply();
      const beforeBalance = await tokenV2.balanceOf(deployer.address);

      const tx = await tokenV2
        .connect(deployer)
        .mint(deployer.address, amount2);

      await tx.wait();

      const afterTotalSupply = await tokenV2.totalSupply();
      expect(afterTotalSupply).to.be.greaterThan(beforeTotalSupply);
      const afterBalance = await tokenV2.balanceOf(deployer.address);
      expect(afterBalance).to.be.greaterThan(beforeBalance);
    });

    it("9. User1 should not be able to mint the token", async () => {
      const amount2 = 5000;
      await expect(tokenV2.connect(user1).mint(user1.address, amount2)).to.be
        .reverted;
    });

    it("10. Only owner should be able to burn the token", async () => {
      const amount2 = amountToEther(2000);
      const beforeTotalSupply = await tokenV2.totalSupply();
      const beforeBalance = await tokenV2.balanceOf(deployer.address);

      const tx = await tokenV2
        .connect(deployer)
        .burn(deployer.address, amount2);

      await tx.wait();

      const afterTotalSupply = await tokenV2.totalSupply();
      expect(afterTotalSupply).to.be.lessThan(beforeTotalSupply);

      const afterBalance = await tokenV2.balanceOf(deployer.address);
      expect(afterBalance).to.be.lessThan(beforeBalance);
    });

    it("11. User1 should not be able to burn the token", async () => {
      const amount2 = amountToEther(2000);
      await expect(tokenV2.connect(user1).burn(user1.address, amount2)).to.be
        .reverted;
    });

    it("12. User1 should be able to buy the tokens", async () => {
      const beforeBalance = await tokenV2.balanceOf(user1.address);

      const valueOption = { value: amountToEther(2) };
      await tokenV2.connect(user1).buy(valueOption);

      const afterBalance = await tokenV2.balanceOf(deployer.address);
      expect(afterBalance).to.be.greaterThan(beforeBalance);
    });
  });
});
