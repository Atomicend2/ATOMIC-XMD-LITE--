// index.js
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const logger = pino({ level: 'silent' });
const { Boom } = require('@hapi/boom');
const { Low, JSONFile } = require('lowdb');
require('dotenv').config();

// ====== SESSION SETUP ======
const SESSION_ID = process.env.SESSION_ID || '';
const authFile = './session.json';

// Decode base64 session and write to session.json
if (SESSION_ID) {
  fs.writeFileSync(authFile, Buffer.from(SESSION_ID, 'base64').toString());
}

const { state, saveState } = useSingleFileAuthState(authFile);

// ====== DB Setup ======
const adapter = new JSONFile('./db.json');
const db = new Low(adapter);
await db.read();
db.data ||= { sudo: [], autosend: '' };

// ====== Socket Connection ======
async function start() {
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    logger,
    printQRInTerminal: true,
    auth: state,
    version
  });

  sock.ev.on('creds.update', saveState);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) start();
    } else if (connection === 'open') {
      console.log('✅ Bot connected!');
    }
  });

  // ====== Message Handler ======
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
    if (!text.startsWith('.')) return;

    const [cmd, ...args] = text.slice(1).trim().split(/ +/);
    const files = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const command = require(`./commands/${file}`);
      if (command.name === cmd) {
        try {
          await command.code(m, { sock, args, db });
        } catch (e) {
          console.error(e);
          sock.sendMessage(m.key.remoteJid, { text: '❌ Error running command.' }, { quoted: m });
        }
        break;
      }
    }
  });
}

start();
