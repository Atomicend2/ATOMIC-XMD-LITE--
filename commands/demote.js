module.exports = {
  name: 'demote',
  category: 'Group',
  desc: 'Demote a group admin',
  async code(m, { sock, isAdmin, isBotAdmin }) {
    if (!isAdmin || !isBotAdmin) return m.reply('Bot and you must be admin');
    if (!m.mentionedJid[0]) return m.reply('Mention someone to demote.');
    await sock.groupParticipantsUpdate(m.chat, [m.mentionedJid[0]], 'demote');
    m.reply('Demoted!');
  }
};