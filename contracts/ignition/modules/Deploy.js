const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploy account:", deployer.address);

  const Welcome = await ethers.getContractFactory("Birra20VentiWelcome");
  
  console.log("\n📦 Deploy Birra20VentiWelcome (LSP8)...");
  const welcome = await Welcome.deploy(
    "Birra20Venti Welcome",  // name
    "B20W",                  // symbol
    deployer.address         // owner temporaneo
  );
  await welcome.waitForDeployment();
  const address = await welcome.getAddress();
  console.log("✅ Birra20VentiWelcome deployato:", address);

  // Trasferisci ownership all'admin EOA
  console.log("\n🔑 Trasferimento ownership all'admin EOA...");
  const adminEOA = process.env.ADMIN_CLIENTE;
  await (await welcome.transferOwnership(adminEOA)).wait();
  console.log("✅ Ownership trasferita a:", adminEOA);

  console.log("\n═══════════════════════════════════════════════");
  console.log("✅ DEPLOY COMPLETATO");
  console.log("═══════════════════════════════════════════════");
  console.log("Birra20VentiWelcome (LSP8):", address);
  console.log("Owner (admin EOA):", adminEOA);
  console.log("═══════════════════════════════════════════════");
  console.log("⚠️  Salva questo indirizzo nel .env del server!");
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
