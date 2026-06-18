const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Signer:", signer.address);

  const CONTRACT_ADDRESS = "0x12a4AFEC7B552081517D0a6C668D16FF536A04e7";
  const CLIENTE = "0x4BE6502A3Ad8ce1ab5127A042C678918F07Af351";
  const EVENTO = "Evento Test 19-06-2026";
  const IPFS_URI = "https://moccasin-solid-starfish-627.mypinata.cloud/ipfs/bafkreig5ajgjrswawkmrtcjvbqkpyfjlgc57ggc6ytlxsrdls4tfw6jyay";
  const WIDTH = 2040;
  const HEIGHT = 972;

  const ABI = [
    "function mintBenvenuto(address cliente, string calldata evento, string calldata ipfsImageURI, uint256 imageWidth, uint256 imageHeight) external",
    "event TokenBenvenutoMintato(address indexed cliente, bytes32 tokenId, string evento, uint256 timestamp)"
  ];

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  console.log("\n🍺 Mint token benvenuto per:", CLIENTE);
  const tx = await contract.mintBenvenuto(CLIENTE, EVENTO, IPFS_URI, WIDTH, HEIGHT);
  const receipt = await tx.wait();
  console.log("✅ Mint completato! TxHash:", receipt.hash);
  console.log("🔗 Blockscout:", `https://explorer.execution.testnet.lukso.network/tx/${receipt.hash}`);
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
