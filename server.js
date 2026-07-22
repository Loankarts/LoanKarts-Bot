const express = require("express");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");

const app = express();

let latestQR = "";

app.get("/", (req, res) => {
  if (latestQR) {
    res.send(`<img src="${latestQR}" />`);
  } else {
    res.send("QR load ho raha hai...");
  }
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    browser: ["Chrome", "Desktop", "1.0"], // 🔥 important fix
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { qr, connection, lastDisconnect } = update;

    if (qr) {
      latestQR = await QRCode.toDataURL(qr);
      console.log("QR Updated");
    }

    if (connection === "close") {
      console.log("❌ Disconnected, reconnecting...");
      startBot(); // 🔥 auto reconnect
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected!");
    }
  });
}

startBot();

app.listen(process.env.PORT || 3000);