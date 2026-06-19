const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function inviaConfermaCliente(destinatario, nome, address) {
  await transporter.sendMail({
    from: `"Birra20Venti" <${process.env.SMTP_FROM}>`,
    to: destinatario,
    subject: "Benvenuto nel programma fedeltà Birra20Venti! 🍺",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px">
        <h2 style="color:#F5A623">🍺 Benvenuto da Birra20Venti!</h2>
        <p>Ciao <strong>${nome}</strong>,</p>
        <p>La tua registrazione è avvenuta con successo!</p>
        <img src="${process.env.IPFS_IMAGE_URI}" alt="Birra20Venti Welcome Token" style="width:100%;border-radius:12px;margin:16px 0" />
        <div style="background:#1a1a1a;border-radius:12px;padding:24px;margin:16px 0;color:#fff">
          <p style="font-size:16px;margin-bottom:8px">🎁 Il tuo premio:</p>
          <p style="font-size:20px;font-weight:bold;color:#F5A623">1 birra omaggio ogni 5 acquisti</p>
        </div>
        <p>Per ricevere il tuo omaggio, ricorda di <strong>ordinare sempre con i dati con cui ti sei registrato</strong>.</p>
        <p style="margin-top:16px">👉 <a href="https://www.birra20ventifidelity.it/shop.html" style="color:#F5A623;font-weight:bold">Vai allo shop</a></p>
<p style="margin-top:12px">🎟️ <a href="https://registrazione-eventi.birra20ventifidelity.it/verifica.html?address=${address}" style="color:#F5A623;font-weight:bold">Verifica il tuo token</a></p>
        <p style="margin-top:24px;color:#8E8E9A;font-size:12px">Birra20Venti — Il tuo birrificio artigianale</p>
      </div>
    `,
  });
}

async function inviaNotificaBirrificio(datiCliente) {
  await transporter.sendMail({
    from: `"Birra20Venti Sistema" <${process.env.SMTP_FROM}>`,
    to: process.env.BIRRIFICIO_EMAIL,
    subject: `Nuova registrazione: ${datiCliente.nome} ${datiCliente.cognome}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px">
        <h2>🍺 Nuova registrazione evento</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;color:#666">Nome</td><td style="padding:8px;font-weight:bold">${datiCliente.nome}</td></tr>
          <tr><td style="padding:8px;color:#666">Cognome</td><td style="padding:8px;font-weight:bold">${datiCliente.cognome}</td></tr>
          <tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px;font-weight:bold">${datiCliente.email}</td></tr>
          <tr><td style="padding:8px;color:#666">Evento</td><td style="padding:8px;font-weight:bold">${datiCliente.evento}</td></tr>
          <tr><td style="padding:8px;color:#666">Indirizzo wallet</td><td style="padding:8px;font-family:monospace;font-size:11px">${datiCliente.address}</td></tr>
          <tr><td style="padding:8px;color:#666">Registrato il</td><td style="padding:8px">${new Date().toLocaleString("it-IT")}</td></tr>
        </table>
      </div>
    `,
  });
}

module.exports = { inviaConfermaCliente, inviaNotificaBirrificio };