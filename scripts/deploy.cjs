/* eslint-env node */
/* global require, process */
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying BombRiderNFT contract to Sepolia...");

  // Obtém o deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Verifica o saldo
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  // Deploy do contrato
  const BombRiderNFT = await hre.ethers.getContractFactory("BombRiderNFT");

  console.log("Deploying contract...");
  const contract = await BombRiderNFT.deploy();

  console.log("Waiting for deployment confirmation...");
  await contract.deployed();

  console.log("✅ BombRiderNFT deployed to:", contract.address);
  console.log("🔗 Transaction hash:", contract.deployTransaction.hash);

  // Salva as informações do contrato em um arquivo
  const fs = require('fs');
  const contractInfo = {
    address: contract.address,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    transactionHash: contract.deployTransaction.hash,
    deployedAt: new Date().toISOString(),
    abi: JSON.parse(contract.interface.format('json'))
  };

  fs.writeFileSync(
    './contract-info.json',
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("📄 Contract info saved to contract-info.json");

  // Aguarda algumas confirmações antes de verificar
  if (hre.network.name !== "hardhat") {
    console.log("⏳ Waiting for block confirmations...");
    await contract.deployTransaction.wait(5);

    // Tenta verificar o contrato no Etherscan
    try {
      console.log("🔍 Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Error verifying contract:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed!");
  console.log("Contract Address:", contract.address);
  console.log("Network:", hre.network.name);
  console.log("Explorer URL:", `https://sepolia.etherscan.io/address/${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
