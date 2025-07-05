module.exports = {
  name: 'snake',
  category: 'Games',
  desc: 'Play a quick snake game (text version)',
  async code(m) {
    const board = [
      '🟩🟩🟩🟩🟩',
      '🟩🟢⬛⬛🟩',
      '🟩⬛⬛⬛🟩',
      '🟩⬛⬛⬛🟩',
      '🟩🟩🟩🟩🟩'
    ].join('\n');
    m.reply('🐍 *Snake Game*\n\n' + board + '\n\n(Just a preview! Full game coming soon)');
  }
};
