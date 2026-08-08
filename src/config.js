require('dotenv').config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.warn(`[config] Peringatan: env var ${name} belum diisi.`);
  }
  return value;
}

module.exports = {
  token: required('DISCORD_TOKEN'),
  clientId: required('CLIENT_ID'),
  guildId: required('GUILD_ID'),
  salaryChannelId: required('SALARY_CHANNEL_ID'),
  itemAdminUserId: process.env.ITEM_ADMIN_USER_ID || null, // Discord User ID yang boleh /setting item (khusus 1 orang)
  dbPath: process.env.DB_PATH || './data/bot.sqlite',

  // Aturan bisnis yang bisa diubah tanpa nyentuh logika
  stampUnitPrice: 5,       // harga 1 sealstamp dalam gold
  transferFeeRate: 0.003,  // fee transfer 0.3%

  // Cap TOTAL member party — begitu member aktif nyampe segini, party dianggap penuh
  // walau ada role yang belum keisi semua.
  partyMemberCap: 8,

  // Definisi role party + kapasitas MAKSIMAL per role (bukan berarti harus keisi semua).
  // Total kapasitas role boleh lebih dari partyMemberCap (fleksibel) — yang jadi batas
  // keras cuma partyMemberCap di atas.
  // `emoji` cuma dipakai buat tombol, embed party sengaja polos tanpa emoji.
  roleRequirements: [
    { code: 'FU', label: 'FU', emoji: '🔴', slots: 2 },
    { code: 'HEALER', label: 'HEALER', emoji: '🏹', slots: 3, subroles: ['Priest', 'Physician', 'Light Fury'] },
    { code: 'MC', label: 'MC', emoji: '🛡️', slots: 1 },
    { code: 'SM', label: 'SM', emoji: '💥', slots: 1 },
    { code: 'MT', label: 'MT', emoji: '🌿', slots: 2, subroles: ['Paladin', 'Destroyer'] },
    { code: 'ICE_STACKING', label: 'ICE STACKING', emoji: '❄️', slots: 1, subroles: ['Adept', 'Elestra'] },
    { code: 'ARCHER', label: 'ARCHER', emoji: '🎯', slots: 2 },
    {
      code: 'DPS',
      label: 'DPS',
      emoji: '⚔️',
      slots: 3,
      subroles: ['Assassin', 'Artillery', 'Crusader', 'Dancer', 'Dark Avenger', 'Gear Master', 'Inquisitor', 'Sniper', 'Saleana', 'Shooting Star', 'Screamer'],
    },
  ],
};