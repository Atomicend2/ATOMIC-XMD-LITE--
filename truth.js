module.exports = {
  name: 'truth',
  category: 'Fun',
  desc: 'Get a random truth question',
  async code(m) {
    const truths = [
      'What is your biggest secret?',
      'Who was your first crush?',
      'Have you ever lied to a best friend?',
    ];
    const q = truths[Math.floor(Math.random() * truths.length)];
    m.reply(`🤫 *Truth*: ${q}`);
  }
};
