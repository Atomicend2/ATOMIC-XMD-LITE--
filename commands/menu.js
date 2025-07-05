module.exports = {
  name: 'menu',
  category: 'Main',
  desc: 'Display the command menu',
  async code(m, { db }) {
    const cmds = db?.data?.commands || [];
    let menu = '📜 *ATOMIC-XMD LITE Menu*\n\n';
    cmds.forEach(cmd => {
      menu += `• ${cmd.name} — ${cmd.desc}\n`;
    });
    m.reply(menu);
  }
};
