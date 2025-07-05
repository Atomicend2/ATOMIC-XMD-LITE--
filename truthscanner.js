module.exports = {
  name: 'truthscanner',
  category: 'Fun',
  desc: 'Scans if someone is telling the truth',
  use: '.truthscanner @user',
  async code(m) {
    const outcomes = ['🟢 Truth Detected!', '🔴 Lie Detected!', '🟡 Inconclusive.'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    m.reply(`🔍 *Truth Scanner Result*\n\n${result}`);
  }
};
