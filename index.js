const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("LoanKarts WhatsApp Bot is Running ✅");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server Started");
});


async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth_info");

    const sock = makeWASocket({
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ qr, connection }) => {

        if (qr) {
            console.log("Scan this QR Code:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("✅ LoanKarts Bot Connected Successfully!");
        }

        if (connection === "close") {
            console.log("Connection Closed");
            startBot();
        }

    });

}

startBot();