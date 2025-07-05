module.exports = {
  name: 'truthscanner',
  category: 'Fun',
  desc: 'Scan someone for truths',
  async code(m) {
    const results = ['Loves pizza 🍕', 'Afraid of spiders 🕷️', 'Crush on someone 😳', 'Secret gamer 🎮'];
    const result = results[Math.floor(Math.random() * results.length)];
    m.reply(`🧠 Truth Scan Result: ${result}`);
  }
};