module.exports = {
  name: 'autosend',
  category: 'Tools',
  desc: 'Send a scheduled message to all groups',
  use: '.autosend <text>',
  async code(m, { sock, args, db }) {
    const text = args.join(' ');
    if (!text) return m.reply('Please provide text to send.');
    db.data.autosend = text;
    m.reply('Message set for auto send.');
  }
};
