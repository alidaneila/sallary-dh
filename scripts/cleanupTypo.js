const db = require('../src/database/db');

const deleted = db.prepare(`
  DELETE FROM item_catalog
  WHERE item_name IN (?, ?)
`).run(
  'DDN Legend Strom Triangular',
  'DDN Unique Strom Triangular'
);

console.log(`Terhapus: ${deleted.changes} row lama yang typo.`);