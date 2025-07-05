const { Low, JSONFile } = require('lowdb');
const adapter = new JSONFile('./db.json');
const db = new Low(adapter);
(async () => await db.read())();
module.exports = db;