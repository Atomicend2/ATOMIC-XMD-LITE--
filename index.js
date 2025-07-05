const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const Pino = require('pino');

const loadDB = require('./db');
const { Boom } = require('@hapi/boom');
const logger = Pino({ level: 'silent' });

async function startBot() {
  const db = await loadDB();

  const { state, saveState } = useSingleFileAuthState('./session.json');

  const sock = makeWASocket({
    printQRInTerminal: true,
    logger,
    auth: state,
    version: await fetchLatestBaileysVersion().then(v => v.version),
    browser: ['ATOMIC-XMD-LITE', 'Safari', '1.0']
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
    if (!text.startsWith('.')) return;

    const [cmd, ...args] = text.slice(1).trim().split(/ +/);

    const commandsPath = path.join(__dirname, 'commands');
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const command = require(path.join(commandsPath, file));
      if (command.name === cmd) {
        try {
          await command.code(m, { sock, args, db });
        } catch (err) {
          console.error(err);
          m.reply('⚠️ Error executing command.');
        }
        break;
      }
    }
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startBot();
      } else {
        console.log('Logged out.');
      }
    }
  });
}

startBot();
