module.exports = {
  name: 'tic',
  category: 'Games',
  desc: 'Play a round of Tic-Tac-Toe',
  async code(m) {
    const board = [
      '❌ | ⭕ | ❌',
      '⭕ | ❌ | ⭕',
      '❌ | ⭕ | ❌'
    ].join('\n');
    m.reply('🎮 *Tic-Tac-Toe*\n\n' + board + '\n\n(This is a static preview)');
  }
};
