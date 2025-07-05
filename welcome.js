
module.exports = {
  name: 'welcome',
  category: 'Group',
  desc: 'Enable or disable welcome messages',
  use: '.welcome on / .welcome off',
  async code(m, { args, db }) {
    if (!m.isGroup) return m.reply('This command can only be used in groups.');
    const option = args[0];
    if (!['on', 'off'].includes(option)) return m.reply('Usage: .welcome on / .welcome off');

    db.data.welcome = db.data.welcome || {};
    db.data.welcome[m.chat] = option === 'on';
    m.reply(`Welcome message ${option === 'on' ? 'enabled' : 'disabled'} in this group.`);
  }
};
