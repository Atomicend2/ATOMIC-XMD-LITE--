const axios = require('axios');
module.exports = {
  name: 'gpt',
  category: 'AI',
  desc: 'Ask GPT a question',
  use: '.gpt <question>',
  async code(m, { args }) {
    const prompt = args.join(' ');
    if (!prompt) return m.reply('Please provide a prompt.');
    try {
      const res = await axios.post('https://api.openai.com/v1/completions', {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 100
      }, {
        headers: {
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'application/json'
        }
      });
      const reply = res.data.choices[0].text.trim();
      m.reply(reply);
    } catch (e) {
      m.reply('Error contacting GPT API.');
    }
  }
};