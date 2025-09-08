/* eslint-env node, mocha */
/* global require, describe, it, beforeEach */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrabCoin", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;

  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000"); // 1M tokens
  const CLEANING_REWARD = ethers.utils.parseEther("10");
  const CRAB_REWARD = ethers.utils.parseEther("1");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CrabCoin = await ethers.getContractFactory("CrabCoin");
    contract = await CrabCoin.deploy();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set correct constants", async function () {
      expect(await contract.CLEANING_REWARD()).to.equal(CLEANING_REWARD);
      expect(await contract.CRAB_REWARD()).to.equal(CRAB_REWARD);
    });

    it("Should mint initial supply to owner", async function () {
      expect(await contract.totalSupply()).to.equal(INITIAL_SUPPLY);
      expect(await contract.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Rewards", function () {
    it("Should reward cleaning correctly", async function () {
      const initialBalance = await contract.balanceOf(addr1.address);
      await contract.rewardCleaning(addr1.address);

      expect(await contract.balanceOf(addr1.address)).to.equal(initialBalance.add(CLEANING_REWARD));
      expect(await contract.getTotalCleaningRewards(addr1.address)).to.equal(CLEANING_REWARD);
    });

    it("Should reward crab finding correctly", async function () {
      const initialBalance = await contract.balanceOf(addr1.address);
      await contract.rewardCrab(addr1.address);

      expect(await contract.balanceOf(addr1.address)).to.equal(initialBalance.add(CRAB_REWARD));
      expect(await contract.getTotalCrabRewards(addr1.address)).to.equal(CRAB_REWARD);
    });

    it("Should calculate total rewards correctly", async function () {
      await contract.rewardCleaning(addr1.address);
      await contract.rewardCrab(addr1.address);
      await contract.rewardCrab(addr1.address);

      const expectedTotal = CLEANING_REWARD.add(CRAB_REWARD).add(CRAB_REWARD);
      expect(await contract.getTotalRewards(addr1.address)).to.equal(expectedTotal);
    });

    it("Should only allow owner to reward", async function () {
      await expect(
        contract.connect(addr1).rewardCleaning(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        contract.connect(addr1).rewardCrab(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Token Operations", function () {
    it("Should allow burning tokens", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      const initialBalance = await contract.balanceOf(owner.address);

      await contract.burn(burnAmount);

      expect(await contract.balanceOf(owner.address)).to.equal(initialBalance.sub(burnAmount));
      expect(await contract.totalSupply()).to.equal(INITIAL_SUPPLY.sub(burnAmount));
    });

    it("Should allow owner to mint additional tokens", async function () {
      const mintAmount = ethers.utils.parseEther("50000");
      const initialSupply = await contract.totalSupply();

      await contract.mintAdditional(mintAmount);

      expect(await contract.totalSupply()).to.equal(initialSupply.add(mintAmount));
      expect(await contract.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY.add(mintAmount));
    });

    it("Should have correct decimals", async function () {
      expect(await contract.decimals()).to.equal(18);
    });
  });
});
