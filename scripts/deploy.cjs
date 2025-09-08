/* eslint-env node */
/* global require, process */
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MangueRider contracts to Sepolia...");

  // Obtém o deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Verifica o saldo
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  // Deploy do contrato CrabCoin
  console.log("Deploying CrabCoin contract...");
  const CrabCoin = await hre.ethers.getContractFactory("CrabCoin");
  const crabCoin = await CrabCoin.deploy();
  await crabCoin.deployed();
  console.log("✅ CrabCoin deployed to:", crabCoin.address);

  // Deploy do contrato MangueRiderNFT
  console.log("Deploying MangueRiderNFT contract...");
  const MangueRiderNFT = await hre.ethers.getContractFactory("MangueRiderNFT");
  const nftContract = await MangueRiderNFT.deploy();
  await nftContract.deployed();
  console.log("✅ MangueRiderNFT deployed to:", nftContract.address);

  console.log("🔗 CrabCoin Transaction hash:", crabCoin.deployTransaction.hash);
  console.log("🔗 NFT Transaction hash:", nftContract.deployTransaction.hash);

  // Salva as informações dos contratos em um arquivo
  const fs = require('fs');
  const contractInfo = {
    crabCoin: {
      address: crabCoin.address,
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      transactionHash: crabCoin.deployTransaction.hash,
      deployedAt: new Date().toISOString(),
      abi: JSON.parse(crabCoin.interface.format('json'))
    },
    nft: {
      address: nftContract.address,
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      transactionHash: nftContract.deployTransaction.hash,
      deployedAt: new Date().toISOString(),
      abi: JSON.parse(nftContract.interface.format('json'))
    }
  };

  fs.writeFileSync(
    './contract-info.json',
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("📄 Contract info saved to contract-info.json");

  // Aguarda algumas confirmações antes de verificar
  if (hre.network.name !== "hardhat") {
    console.log("⏳ Waiting for block confirmations...");
    await Promise.all([
      crabCoin.deployTransaction.wait(5),
      nftContract.deployTransaction.wait(5)
    ]);

    // Tenta verificar os contratos no Etherscan
    try {
      console.log("🔍 Verifying CrabCoin contract on Etherscan...");
      await hre.run("verify:verify", {
        address: crabCoin.address,
        constructorArguments: [],
      });
      console.log("✅ CrabCoin contract verified on Etherscan");

      console.log("🔍 Verifying MangueRiderNFT contract on Etherscan...");
      await hre.run("verify:verify", {
        address: nftContract.address,
        constructorArguments: [],
      });
      console.log("✅ MangueRiderNFT contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Error verifying contracts:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed!");
  console.log("CrabCoin Address:", crabCoin.address);
  console.log("MangueRiderNFT Address:", nftContract.address);
  console.log("Network:", hre.network.name);
  console.log("CrabCoin Explorer URL:", `https://sepolia.etherscan.io/address/${crabCoin.address}`);
  console.log("NFT Explorer URL:", `https://sepolia.etherscan.io/address/${nftContract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
