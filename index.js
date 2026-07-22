const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth_info");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
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

    });

}

startBot();