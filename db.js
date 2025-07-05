let db;

async function loadDB() {
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');

  const adapter = new JSONFile('./db.json');
  db = new Low(adapter);
  await db.read();

  // FIX: Prevent "missing default data" error
  if (!db.data) {
    db.data = {
      users: [],
      sudo: [],
      autosend: ''
    };
    await db.write(); // Save the default structure
  }

  return db;
}

module.exports = loadDB;
