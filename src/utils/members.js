/**
 * Tambahin field displayName ke tiap baris member (dipakai buat label select menu).
 * Gagal fetch satu user tidak menggagalkan yang lain — fallback ke user_id.
 *
 * Optimasi:
 * - Cek cache dulu (guild.members.cache) sebelum fetch ke API.
 * - Yang belum ada di cache di-fetch PARALEL (Promise.all), bukan satu-satu berurutan.
 */
async function resolveDisplayNames(guild, members) {
  const results = await Promise.all(
    members.map(async (m) => {
      // 1) Coba dari cache dulu — instan, tanpa API call
      const cached = guild.members.cache.get(m.user_id);
      if (cached) {
        return { ...m, displayName: cached.displayName };
      }
 
      // 2) Kalau belum ada di cache, baru fetch ke API
      try {
        const gm = await guild.members.fetch(m.user_id);
        return { ...m, displayName: gm.displayName };
      } catch (err) {
        // member mungkin sudah keluar server — fallback ke user_id
        return { ...m, displayName: m.user_id };
      }
    })
  );
 
  return results;
}
 
module.exports = { resolveDisplayNames };