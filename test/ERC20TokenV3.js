const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

let tokenV3;
let deployer, user1;
const tokenName = "ERC20 Token";
const tokenSymbol = "TKN";

const amountToEther = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};
const amount = amountToEther(1000000);

describe("ERC20tokenV3 Test", () => {
  before(async () => {
    const ERC20TokenV3 = await ethers.getContractFactory("ERC20TokenV3");
    tokenV3 = await upgrades.deployProxy(ERC20TokenV3, [amount]);

    const account = await ethers.getSigners();
    deployer = account[0];
    user1 = account[1];
  });

  describe("Phase 1: ERC20 contract with a pre-minting of 1 million tokens", () => {
    it("1. Token should have name", async () => {
      const name = await tokenV3.name();
      expect(name).to.be.equal(tokenName);
    });

    it("2. Token should have symbol", async () => {
      const symbol = await tokenV3.symbol();
      expect(symbol).to.be.equal(tokenSymbol);
    });

    it("3. Token should have 1 million tokens", async () => {
      const totalSupply = await tokenV3.totalSupply();
      expect(totalSupply.toString()).to.be.equal(amount.toString());
    });

    it("4. Deployer should have balance of 10000 tokens", async () => {
      const balance = await tokenV3.balanceOf(deployer.address);
      expect(balance.toString()).to.be.equal(amount.toString());
    });

    it("5. Deployer should be token owner", async () => {
      const owner = await tokenV3.owner();
      expect(owner).to.be.equal(deployer.address);
    });
  });

  describe("Phase 2: Testing mint(), burn(), allowance() functionalities", () => {
    it("8. Only owner should be able to mint the token", async () => {
      const amount2 = amountToEther(5000);
      const beforeTotalSupply = await tokenV3.totalSupply();
      const beforeBalance = await tokenV3.balanceOf(deployer.address);

      const tx = await tokenV3
        .connect(deployer)
        .mint(deployer.address, amount2);

      await tx.wait();

      const afterTotalSupply = await tokenV3.totalSupply();
      expect(afterTotalSupply).to.be.greaterThan(beforeTotalSupply);
      const afterBalance = await tokenV3.balanceOf(deployer.address);
      expect(afterBalance).to.be.greaterThan(beforeBalance);
    });

    it("9. User1 should not be able to mint the token", async () => {
      const amount2 = 5000;
      await expect(tokenV3.connect(user1).mint(user1.address, amount2)).to.be
        .reverted;
    });

    it("10. Only owner should be able to burn the token", async () => {
      const amount2 = amountToEther(2000);
      const beforeTotalSupply = await tokenV3.totalSupply();
      const beforeBalance = await tokenV3.balanceOf(deployer.address);

      const tx = await tokenV3
        .connect(deployer)
        .burn(deployer.address, amount2);

      await tx.wait();

      const afterTotalSupply = await tokenV3.totalSupply();
      expect(afterTotalSupply).to.be.lessThan(beforeTotalSupply);

      const afterBalance = await tokenV3.balanceOf(deployer.address);
      expect(afterBalance).to.be.lessThan(beforeBalance);
    });

    it("11. User1 should not be able to burn the token", async () => {
      const amount2 = amountToEther(2000);
      await expect(tokenV3.connect(user1).burn(user1.address, amount2)).to.be
        .reverted;
    });

    it("12. User1 should be able to buy the tokens", async () => {
      const beforeBalance = await tokenV3.balanceOf(user1.address);
      const valueOption = { value: amountToEther(2) };
      await tokenV3.connect(user1).buy(valueOption);

      const afterBalance = await tokenV3.balanceOf(deployer.address);
      expect(afterBalance).to.be.greaterThan(beforeBalance);
    });

    describe("Phase 3: Testing Withdraw Functionality", () => {
      it("Only owner should be able to withdraw the amount", async () => {
        const beforeBalance = await tokenV3.getContractBalance();
        const amount = amountToEther(1);
        const tx = await tokenV3.connect(deployer).withdraw(amount);
        await tx.wait();
        const afterBalance = await tokenV3.getContractBalance();
        expect(afterBalance).to.be.lessThan(beforeBalance);
      });
    });
  });
});
