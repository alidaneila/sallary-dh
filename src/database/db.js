const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const config = require('../config');

const resolvedPath = path.resolve(process.cwd(), config.dbPath);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// --- migrasi one-time: hapus kolom raid_type & tier dari item_catalog skema lama ---
const itemCatalogCols = db.prepare(`PRAGMA table_info(item_catalog)`).all().map((c) => c.name);
if (itemCatalogCols.includes('raid_type') || itemCatalogCols.includes('tier')) {
  db.exec(`DROP INDEX IF EXISTS idx_item_catalog_search`);
  if (itemCatalogCols.includes('raid_type')) db.exec(`ALTER TABLE item_catalog DROP COLUMN raid_type`);
  if (itemCatalogCols.includes('tier')) db.exec(`ALTER TABLE item_catalog DROP COLUMN tier`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_item_catalog_search ON item_catalog (is_active, item_name)`);
  console.log('[db] Migrasi selesai: kolom raid_type/tier dihapus dari item_catalog.');
}

module.exports = db;
