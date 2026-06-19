const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploy account (firma):", deployer.address);

  const CHAININTEGRATE_UP = process.env.CHAININTEGRATE_UP_MAINNET;
  const ADMIN_OPERATIVO   = process.env.ADMIN_CLIENTE;

  console.log("Owner (creator visibile):", CHAININTEGRATE_UP);
  console.log("Admin operativo (mint):", ADMIN_OPERATIVO);

  const Welcome = await ethers.getContractFactory("Birra20VentiWelcome");

  console.log("\n📦 Deploy Birra20VentiWelcome (LSP8)...");
  const welcome = await Welcome.deploy(
    "Birra20Venti Welcome",
    "B20W",
    CHAININTEGRATE_UP,   // owner = UP ChainIntegrate (creator visibile, permanente)
    ADMIN_OPERATIVO       // admin = EOA che firma i mint
  );
  await welcome.waitForDeployment();
  const address = await welcome.getAddress();

  console.log("\n═══════════════════════════════════════════════");
  console.log("✅ DEPLOY COMPLETATO");
  console.log("═══════════════════════════════════════════════");
  console.log("Birra20VentiWelcome (LSP8):", address);
  console.log("Owner (creator):", CHAININTEGRATE_UP);
  console.log("Admin (mint):", ADMIN_OPERATIVO);
  console.log("═══════════════════════════════════════════════");
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });