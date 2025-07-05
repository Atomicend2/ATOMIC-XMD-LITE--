module.exports = {
  name: 'settings',
  category: 'Owner',
  desc: 'Show current settings',
  async code(m, { db }) {
    const set = db?.data || {};
    m.reply(`Current Settings:\nSudo Users: ${set.sudo?.length || 0}\nAutosend: ${set.autosend || 'None'}`);
  }
};
