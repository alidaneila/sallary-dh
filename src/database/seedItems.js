/**
 * Isi/update item_catalog dari itemData.js (hasil parseItemData.js).
 * Aman dijalankan berkali-kali:
 * - item_name yang belum ada -> di-INSERT baru.
 * - item_name yang udah ada -> di-UPDATE (category/class/stamp_cost) kalau ada yang beda,
 *   biar perubahan angka stamp/kategori di raw_items.txt beneran ke-apply.
 * Cara pakai: npm run seed-items
 */
const db = require('./db');
const items = require('./itemData');

const existsStmt = db.prepare(
  `SELECT id, category, class, stamp_cost FROM item_catalog WHERE item_name = ?`
);
const insertStmt = db.prepare(`
  INSERT INTO item_catalog (category, class, item_name, stamp_cost)
  VALUES (@category, @class, @item_name, @stamp_cost)
`);
const updateStmt = db.prepare(`
  UPDATE item_catalog
  SET category = @category, class = @class, stamp_cost = @stamp_cost
  WHERE id = @id
`);

let inserted = 0;
let updated = 0;
let unchanged = 0;

const run = db.transaction((rows) => {
  for (const row of rows) {
    const found = existsStmt.get(row.item_name);

    if (found) {
      const isDifferent =
        found.category !== row.category ||
        found.class !== row.class ||
        found.stamp_cost !== row.stamp_cost;

      if (isDifferent) {
        updateStmt.run({ ...row, id: found.id });
        updated += 1;
      } else {
        unchanged += 1;
      }
      continue;
    }

    insertStmt.run(row);
    inserted += 1;
  }
});

run(items);

console.log(
  `[seedItems] Selesai. Ditambahkan: ${inserted}, diupdate: ${updated}, gak berubah: ${unchanged}.`
);