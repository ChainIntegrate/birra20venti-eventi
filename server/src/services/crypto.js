const crypto = require("crypto");

const MASTER_KEY = Buffer.from(process.env.MASTER_ENCRYPTION_KEY, "hex");

function cifra(testo) {
  const iv  = crypto.randomBytes(16);
  const c   = crypto.createCipheriv("aes-256-gcm", MASTER_KEY, iv);
  const enc = Buffer.concat([c.update(testo, "utf8"), c.final()]);
  const tag = c.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

function decifra(cifrato) {
  const [ivHex, tagHex, encHex] = cifrato.split(":");
  const iv  = Buffer.from(ivHex,  "hex");
  const tag = Buffer.from(tagHex, "hex");
  const enc = Buffer.from(encHex, "hex");
  const d   = crypto.createDecipheriv("aes-256-gcm", MASTER_KEY, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}

module.exports = { cifra, decifra };