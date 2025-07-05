module.exports = {
  name: 'dare',
  category: 'Fun',
  desc: 'Send a random dare',
  async code(m) {
    const dares = ['Dance in public.', 'Call your crush.', 'Post an embarrassing photo.'];
    const pick = dares[Math.floor(Math.random() * dares.length)];
    m.reply(pick);
  }
};