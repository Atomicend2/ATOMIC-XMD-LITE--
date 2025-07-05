const db = require('./db'); // already uses lowdb
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const { default: P } = require('pino');

// Load auth
const { state, saveState } = useSingleFileAuthState('./session.json');

// 🧠 Wrap everything inside an async IIFE
(async () => {
  await db.read();

  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
    if (!text.startsWith('.')) return;

    const [cmd, ...args] = text.slice(1).trim().split(/\s+/);
    const fs = require('fs');
    const commands = fs.readdirSync('./commands');

    for (const file of commands) {
      const command = require(`./commands/${file}`);
      if (command.name === cmd) {
        try {
          await command.code(m, { sock, args, db });
        } catch (err) {
          m.reply('❌ Command error.');
        }
        break;
      }
    }
  });
})();
