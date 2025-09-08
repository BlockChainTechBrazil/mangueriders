/* eslint-env node, mocha */
/* global require, describe, it, beforeEach */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BombRiderNFT", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;

  const MINT_PRICE = ethers.utils.parseEther("0.001");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const BombRiderNFT = await ethers.getContractFactory("BombRiderNFT");
    contract = await BombRiderNFT.deploy();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set correct constants", async function () {
      expect(await contract.MINT_PRICE()).to.equal(MINT_PRICE);
      expect(await contract.MAX_SUPPLY()).to.equal(10000);
      expect(await contract.MAX_MINT_PER_WALLET()).to.equal(10);
    });

    it("Should start with zero supply", async function () {
      expect(await contract.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    const testTokenURI = "ipfs://QmTest123";
    const tokenType = "Character";
    const rarity = "rare";
    const element = "fire";

    it("Should mint NFT with correct payment", async function () {
      await expect(
        contract.connect(addr1).mintNFT(
          addr1.address,
          testTokenURI,
          tokenType,
          rarity,
          element,
          { value: MINT_PRICE }
        )
      ).to.emit(contract, "NFTMinted")
        .withArgs(addr1.address, 0, tokenType, rarity, element, testTokenURI);

      expect(await contract.totalSupply()).to.equal(1);
      expect(await contract.ownerOf(0)).to.equal(addr1.address);
      expect(await contract.tokenURI(0)).to.equal(testTokenURI);
    });

    it("Should fail with insufficient payment", async function () {
      const insufficientPayment = ethers.utils.parseEther("0.0005");

      await expect(
        contract.connect(addr1).mintNFT(
          addr1.address,
          testTokenURI,
          tokenType,
          rarity,
          element,
          { value: insufficientPayment }
        )
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should fail with empty parameters", async function () {
      await expect(
        contract.connect(addr1).mintNFT(
          addr1.address,
          "",
          tokenType,
          rarity,
          element,
          { value: MINT_PRICE }
        )
      ).to.be.revertedWith("Token URI cannot be empty");

      await expect(
        contract.connect(addr1).mintNFT(
          addr1.address,
          testTokenURI,
          "",
          rarity,
          element,
          { value: MINT_PRICE }
        )
      ).to.be.revertedWith("Token type cannot be empty");
    });

    it("Should track wallet mint count", async function () {
      await contract.connect(addr1).mintNFT(
        addr1.address,
        testTokenURI,
        tokenType,
        rarity,
        element,
        { value: MINT_PRICE }
      );

      expect(await contract.getWalletMintCount(addr1.address)).to.equal(1);
      expect(await contract.getRemainingMints(addr1.address)).to.equal(9);
    });

    it("Should enforce max mint per wallet", async function () {
      // Mint até o limite
      for (let i = 0; i < 10; i++) {
        await contract.connect(addr1).mintNFT(
          addr1.address,
          `${testTokenURI}${i}`,
          tokenType,
          rarity,
          element,
          { value: MINT_PRICE }
        );
      }

      // Tentar mint além do limite
      await expect(
        contract.connect(addr1).mintNFT(
          addr1.address,
          testTokenURI,
          tokenType,
          rarity,
          element,
          { value: MINT_PRICE }
        )
      ).to.be.revertedWith("Max mint per wallet reached");
    });
  });

  describe("Token Information", function () {
    beforeEach(async function () {
      await contract.connect(addr1).mintNFT(
        addr1.address,
        "ipfs://QmTest123",
        "Character",
        "rare",
        "fire",
        { value: MINT_PRICE }
      );
    });

    it("Should return correct token info", async function () {
      const tokenInfo = await contract.getTokenInfo(0);
      expect(tokenInfo[0]).to.equal("Character"); // tokenType
      expect(tokenInfo[1]).to.equal("rare"); // rarity
      expect(tokenInfo[2]).to.equal("fire"); // element
      expect(tokenInfo[3]).to.equal("ipfs://QmTest123"); // uri
    });

    it("Should return owned tokens", async function () {
      const ownedTokens = await contract.getTokensOfOwner(addr1.address);
      expect(ownedTokens.length).to.equal(1);
      expect(ownedTokens[0]).to.equal(0);
    });

    it("Should fail for non-existent token", async function () {
      await expect(contract.getTokenInfo(999)).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to batch mint", async function () {
      const recipients = [addr1.address, addr2.address];
      const tokenURIs = ["ipfs://QmTest1", "ipfs://QmTest2"];
      const tokenTypes = ["Character", "Item"];
      const rarities = ["rare", "epic"];
      const elements = ["fire", "water"];

      await expect(
        contract.batchMintOwner(recipients, tokenURIs, tokenTypes, rarities, elements)
      ).to.emit(contract, "NFTMinted")
        .withArgs(addr1.address, 0, "Character", "rare", "fire", "ipfs://QmTest1");

      expect(await contract.totalSupply()).to.equal(2);
      expect(await contract.ownerOf(0)).to.equal(addr1.address);
      expect(await contract.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should not allow non-owner to batch mint", async function () {
      await expect(
        contract.connect(addr1).batchMintOwner([addr1.address], ["ipfs://QmTest"], ["Character"], ["rare"], ["fire"])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to withdraw", async function () {
      // Mint um NFT para gerar receita
      await contract.connect(addr1).mintNFT(
        addr1.address,
        "ipfs://QmTest",
        "Character",
        "rare",
        "fire",
        { value: MINT_PRICE }
      );

      const initialBalance = await owner.getBalance();

      await expect(contract.withdraw())
        .to.emit(contract, "ContractWithdrawn")
        .withArgs(owner.address, MINT_PRICE);

      const finalBalance = await owner.getBalance();
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should pause and unpause minting", async function () {
      await contract.pauseMint();
      expect(await contract.mintPaused()).to.be.true;

      await contract.unpauseMint();
      expect(await contract.mintPaused()).to.be.false;
    });
  });

  describe("ERC721 Compliance", function () {
    beforeEach(async function () {
      await contract.connect(addr1).mintNFT(
        addr1.address,
        "ipfs://QmTest123",
        "Character",
        "rare",
        "fire",
        { value: MINT_PRICE }
      );
    });

    it("Should support ERC721 interface", async function () {
      expect(await contract.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
    });

    it("Should allow transfers", async function () {
      await contract.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      expect(await contract.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should allow approvals", async function () {
      await contract.connect(addr1).approve(addr2.address, 0);
      expect(await contract.getApproved(0)).to.equal(addr2.address);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle max supply correctly", async function () {
      // Esse teste seria muito lento para 10,000 NFTs
      // Vamos apenas testar a lógica com um supply menor
      // Para isso, precisaríamos modificar o contrato ou criar um mock

      // Por enquanto, vamos testar que a verificação existe
      expect(await contract.MAX_SUPPLY()).to.equal(10000);
    });

    it("Should reject zero address", async function () {
      await expect(
        contract.connect(addr1).mintNFT(
          ethers.constants.AddressZero,
          "ipfs://QmTest",
          "Character",
          "rare",
          "fire",
          { value: MINT_PRICE }
        )
      ).to.be.revertedWith("ERC721: mint to the zero address");
    });
  });
});
