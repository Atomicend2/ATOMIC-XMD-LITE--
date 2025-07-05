let db;

async function loadDB() {
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');

  const adapter = new JSONFile('./db.json');
  db = new Low(adapter);

  await db.read();

  // 🛡️ Final fix: provide default data if missing
  if (!db.data) {
    db.data = {
      users: [],
      sudo: [],
      autosend: ""
    };
    await db.write(); // Save initialized structure
  }

  return db;
}

module.exports = loadDB;
