const express = require("express");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

const app = express();

app.get("/", (req, res) => {
  res.send("WhatsApp Bot Running 🚀");
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ qr, connection }) => {
    if (qr) {
      console.log("Scan this QR:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected!");
    }
  });
}

startBot();

app.listen(process.env.PORT || 3000);