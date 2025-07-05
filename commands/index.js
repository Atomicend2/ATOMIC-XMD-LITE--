const fs = require('fs');
const path = require('path');
const db = require('./db');
const logger = require('./logger');
const { WAConnection } = require('@adiwajshing/baileys');

(async () => {
  const sock = new WAConnection();
  sock.logger.level = 'warn';
  await sock.connect();

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;
    const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
    if (!text.startsWith('.')) return;
    const [cmd, ...args] = text.slice(1).trim().split(/ +/);

    const files = fs.readdirSync('./commands');
    for (const file of files) {
      const command = require(`./commands/${file}`);
      if (command.name === cmd) {
        try {
          await command.code(m, { sock, args, db });
        } catch (e) {
          m.reply('Command error.');
        }
        break;
      }
    }
  });
})();