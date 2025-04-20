const { makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { default: makeWASocket } = require('@whiskeysockets/baileys');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

app.get('/', async (req, res) => {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('connection.update', (update) => {
        const { qr, connection } = update;
        if (qr) {
            res.send(`<h1>Scan QR with WhatsApp</h1><img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300" />`);
        } else if (connection === 'open') {
            res.send(`<h1>Connected!</h1>`);
        }
    });

    sock.ev.on('creds.update', saveState);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
