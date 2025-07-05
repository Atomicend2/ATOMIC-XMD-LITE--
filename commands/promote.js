module.exports = {
  name: 'promote',
  category: 'Group',
  desc: 'Promote a member to admin',
  async code(m, { sock, isAdmin, isBotAdmin }) {
    if (!isAdmin || !isBotAdmin) return m.reply('Bot and you must be admin');
    if (!m.mentionedJid[0]) return m.reply('Mention someone to promote.');
    await sock.groupParticipantsUpdate(m.chat, [m.mentionedJid[0]], 'promote');
    m.reply('Promoted!');
  }
};