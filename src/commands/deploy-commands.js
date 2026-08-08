const { REST, Routes } = require('discord.js');
const config = require('../config');

const party = require('./party');
const itemAdd = require('./itemAdd');
const lootAdd = require('./lootAdd');

const commands = [party.data.toJSON(), itemAdd.data.toJSON(), lootAdd.data.toJSON()];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`Mendaftarkan ${commands.length} slash command ke guild ${config.guildId}...`);
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
      body: commands,
    });
    console.log('Selesai. Command langsung aktif di server (guild command, tidak perlu tunggu 1 jam).');
  } catch (err) {
    console.error(err);
  }
})();
