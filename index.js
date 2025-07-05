// index.js

const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@adiwajshing/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const db = require('./db');
const logger = require('./logger');

const { state, saveState } = useSingleFileAuthState('./auth.json');

async function startSock() {
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    version
  });

  sock.ev.on('creds.update', saveState);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.error('Connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) startSock();
    } else if (connection === 'open') {
      logger.log('✅ Connected to WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const type = Object.keys(m.message)[0];
    const body = m.message.conversation || m.message[type]?.text || '';
    if (!body.startsWith('.')) return;

    const args = body.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const cmdFiles = fs.readdirSync(path.join(__dirname, 'commands'));
    for (const file of cmdFiles) {
      const command = require(path.join(__dirname, 'commands', file));
      if (command.name === commandName) {
        try {
          await command.code(m, { sock, args, db });
        } catch (err) {
          logger.error(`Command error in ${file}:`, err.message);
          sock.sendMessage(m.key.remoteJid, { text: '❌ Command failed.' });
        }
        break;
      }
    }
  });
}

startSock();
