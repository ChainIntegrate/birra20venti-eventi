require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.LUKSO_RPC);
const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

const CONTRACT_ADDRESS = process.env.WELCOME_TOKEN_ADDRESS;

const ABI = [
  "function mintBenvenuto(address cliente, string calldata evento, string calldata ipfsImageURI, uint256 imageWidth, uint256 imageHeight) external",
  "function haRicevutoPerEvento(address cliente, string calldata evento) external view returns (bool)",
  "event TokenBenvenutoMintato(address indexed cliente, bytes32 tokenId, string evento, uint256 timestamp)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, adminWallet);

async function mintToken(clienteAddress, evento, ipfsImageURI, width, height) {
  const tx = await contract.mintBenvenuto(clienteAddress, evento, ipfsImageURI, width, height);
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
}

async function haGiaRicevuto(clienteAddress, evento) {
  return await contract.haRicevutoPerEvento(clienteAddress, evento);
}

module.exports = { mintToken, haGiaRicevuto };