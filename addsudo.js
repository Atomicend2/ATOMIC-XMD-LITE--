module.exports = {
  name: 'addsudo',
  category: 'Settings',
  desc: 'Add a user to sudo list',
  use: '.addsudo @user',
  async code(m, { sock, args, isCreator, db }) {
    if (!isCreator) return m.reply('Only the owner can use this command.')
    const mention = m.mentionedJid[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!mention) return m.reply('Mention a user or provide a number.');
    const sudo = db.data.sudo || [];
    if (sudo.includes(mention)) return m.reply('Already a sudo user.');
    sudo.push(mention);
    db.data.sudo = sudo;
    m.reply(`Added to sudo: ${mention}`);
  }
};
