
const fs = require('fs');
const db = require('./db');
const logger = require('./logger');
const { WAConnection } = require('@adiwajshing/baileys');
const commands = require('./commands'); // Auto-loaded plugins
const { Boom } = require('@hapi/boom');

// Create and start the bot
(async () => {
  const sock = new WAConnection();
  sock.logger.level = 'warn';

  await sock.connect();
  logger.log('✅ Bot connected!');

  // Handle messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      '';

    if (!text.startsWith('.')) return;

    const [cmd, ...args] = text.slice(1).trim().split(/ +/);

    for (const command of commands) {
      if (command.name === cmd) {
        try {
          await command.code(m, {
            sock,
            args,
            db,
            isCreator: m.key.fromMe,
            isAdmin: m.key.participant === m.key.remoteJid,
            isBotAdmin: true, // Simplified, enhance if needed
          });
        } catch (err) {
          logger.error(`❌ Error in command ${cmd}:`, err.message);
          m.reply('⚠️ Command failed!');
        }
        break;
      }
    }
  });

  // Group participant update for welcome messages
  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    const welcomes = db.data?.welcome || {};

    if (welcomes[id] && action === 'add') {
      for (const user of participants) {
        await sock.sendMessage(id, {
          text: `👋 Welcome @${user.split('@')[0]} to the group!`,
          mentions: [user]
        });
      }
    }
  });

})();
