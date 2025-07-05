module.exports = {
  name: 'settings',
  category: 'Bot',
  desc: 'View bot settings',
  async code(m, { db }) {
    m.reply('Settings: ' + JSON.stringify(db.data.settings || {}, null, 2));
  }
};