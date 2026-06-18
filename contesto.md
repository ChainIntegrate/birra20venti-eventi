# Birra20Venti Eventi — Contesto Progetto

## Cos'è
Sistema di registrazione eventi con token NFT su LUKSO blockchain.
Il cliente si registra tramite form web, riceve un token NFT di benvenuto
e una email con il benefit (1 birra omaggio ogni 5 acquisti).

---

## Repository
**GitHub**: https://github.com/ChainIntegrate/birra20venti-eventi

```
birra20venti-eventi/
├── contracts/     → Smart contract Solidity (Hardhat)
├── server/        → Node.js backend
├── client/        → Pagina HTML registrazione
└── CONTESTO.md    → Questo file
```

---

## Smart Contract

### Testnet
- **Indirizzo**: `0x12a4AFEC7B552081517D0a6C668D16FF536A04e7`
- **Network**: LUKSO Testnet (chainId 4201)
- **RPC**: https://rpc.testnet.lukso.network

### Mainnet
- **Indirizzo**: `0xd0f655A63032D0c9afAAf1FB558A326FE611D379`
- **Network**: LUKSO Mainnet (chainId 42)
- **RPC**: https://rpc.mainnet.lukso.network

### Indirizzi chiave
- **Owner/Admin EOA**: `0x30D5e2c9BEc1A75515b88d6c80528e9003AeA9EF`
- **ChainIntegrate2 UP Testnet**: `0xAa18E265Bb38cD507eD018AF9abf0FeF16E685C9`
- **ChainIntegrate UP Testnet**: `0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C`
- **ChainIntegrate UP Mainnet**: `0x4a2605796e0d91A9667d6E30365aEEC384C48c27`
- **Birra20Venti UP Mainnet**: `0x1d62B8d2c63B942095AD3C7FFc7e845195D9E718`

---

## Funzionamento Smart Contract

**`Birra20VentiWelcome` (LSP8)**:
- Un contratto unico riusabile per tutti gli eventi
- `mintBenvenuto(address cliente, string evento, string ipfsImageURI, uint256 width, uint256 height)`
- Un solo token per cliente per evento (controllo duplicati)
- Metadati LSP4 per ogni tokenId (immagine + evento specifico)
- Non rideplorare per ogni evento — basta chiamare mintBenvenuto con nuovo evento e CID

---

## Backend Node.js

### File chiave
- `server/src/index.js` — entry point
- `server/src/routes/registrazione.js` — route POST registrazione
- `server/src/services/blockchain.js` — connessione LUKSO, mint token
- `server/src/services/email.js` — invio email cliente e birrificio
- `server/src/services/crypto.js` — cifratura AES-256-GCM chiavi private
- `server/data/clienti.json` — storage clienti (NON in git)

### Variabili .env server (solo su VPS, mai in git)
```
PORT=3002
LUKSO_RPC=https://rpc.mainnet.lukso.network
WELCOME_TOKEN_ADDRESS=0xd0f655A63032D0c9afAAf1FB558A326FE611D379
ADMIN_PRIVATE_KEY=0x... (chiave admin EOA 0x30D5e2c9...)
MASTER_ENCRYPTION_KEY=... (32 bytes hex, stessa di FidelityHub)
SMTP_HOST=smtps.aruba.it
SMTP_PORT=465
SMTP_USER=no-reply@birra20ventifidelity.it
SMTP_PASS=...
SMTP_FROM=no-reply@birra20ventifidelity.it
BIRRIFICIO_EMAIL=birra20venti@gmail.com
IPFS_IMAGE_URI=https://moccasin-solid-starfish-627.mypinata.cloud/ipfs/bafkreig5ajgjrswawkmrtcjvbqkpyfjlgc57ggc6ytlxsrdls4tfw6jyay
IMAGE_WIDTH=2040
IMAGE_HEIGHT=972
EVENTO=Evento Birra20Venti 19-06-2026
```

---

## Frontend

### Pagina registrazione
- `client/index.html` — form HTML puro (no React)
- Nome evento preso dalla variabile `EVENTO` nel .env
- **URL**: https://registrazione-eventi.birra20ventifidelity.it

---

## IPFS / Pinata
- **Gateway**: https://moccasin-solid-starfish-627.mypinata.cloud
- **Account**: ChainIntegrate
- **Immagine attuale**: `bafkreig5ajgjrswawkmrtcjvbqkpyfjlgc57ggc6ytlxsrdls4tfw6jyay`
- **Dimensioni**: 2040x972px

---

## Da Fare
- Passare il nome evento dal server all'HTML (ora è EVENTO_PLACEHOLDER)
- Aggiungere logo Birra20Venti nella pagina
- QR code per l'evento
- Verifica contratto su Blockscout mainnet
- Aggiornare .env VPS con indirizzo mainnet e RPC mainnet