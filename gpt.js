const axios = require('axios');
module.exports = {
  name: 'gpt',
  category: 'AI',
  desc: 'Ask GPT a question',
  use: '.gpt <question>',
  async code(m, { args }) {
    const prompt = args.join(' ');
    if (!prompt) return m.reply('Ask me something.');
    try {
      const res = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      const reply = res.data.choices[0].message.content;
      m.reply(reply);
    } catch (e) {
      m.reply('Error fetching GPT response.');
    }
  }
};
