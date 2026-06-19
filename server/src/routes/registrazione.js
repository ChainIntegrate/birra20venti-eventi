const express = require("express");
const { ethers } = require("ethers");
const { v4: uuidv4 } = require("uuid");
const { cifra } = require("../services/crypto");
const { mintToken, haGiaRicevuto } = require("../services/blockchain");
const { inviaConfermaCliente, inviaNotificaBirrificio } = require("../services/email");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DB_PATH = path.join(__dirname, "../../data/clienti.json");

// Carica o inizializza il DB
function loadDB() {
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── POST /api/registrazione ────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { nome, cognome, email, evento, privacy } = req.body;

    // Validazione
    if (!nome?.trim() || !cognome?.trim()) 
      return res.status(400).json({ success: false, error: "Nome e cognome obbligatori" });
    if (!email || !/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ success: false, error: "Email non valida" });
    if (!privacy)
      return res.status(400).json({ success: false, error: "Devi accettare la privacy" });
    if (!evento?.trim())
      return res.status(400).json({ success: false, error: "Evento non specificato" });

    const db = loadDB();

    // Controlla duplicati per evento
    const esistente = db.find(u => u.email.toLowerCase() === email.toLowerCase() && u.evento === evento);
    if (esistente)
      return res.status(400).json({ success: false, error: "Hai già partecipato a questo evento" });

    // Genera EOA
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    const encryptedPk = cifra(wallet.privateKey);

    // Mint token su LUKSO
    const { txHash } = await mintToken(
      address,
      evento,
      process.env.IPFS_IMAGE_URI,
      parseInt(process.env.IMAGE_WIDTH || "2040"),
      parseInt(process.env.IMAGE_HEIGHT || "972")
    );

    // Salva nel DB
    const cliente = {
      id: uuidv4(),
      nome: nome.trim(),
      cognome: cognome.trim(),
      email: email.toLowerCase().trim(),
      evento,
      address,
      encryptedPk,
      txHash,
      createdAt: Date.now(),
    };
    db.push(cliente);
    saveDB(db);

    // Invia email al cliente
   await inviaConfermaCliente(email, nome, address);

    // Invia notifica al birrificio
    await inviaNotificaBirrificio({ nome, cognome, email, evento, address });

    console.log(`✅ Registrato: ${nome} ${cognome} (${email}) - ${address}`);

    res.json({ success: true, data: { nome, cognome, address, txHash } });

  } catch (err) {
    console.error("❌ Errore registrazione:", err.message);
    res.status(500).json({ success: false, error: "Errore durante la registrazione" });
  }
});

module.exports = router;