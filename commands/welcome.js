module.exports = {
  name: 'welcome',
  category: 'Group',
  desc: 'Welcome new members',
  async code(m, { db }) {
    m.reply('Welcome settings updated (placeholder).');
  }
};