const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./config');
const interactionCreate = require('./handlers/interactionCreate');

// Pastikan database & skema kebentuk sebelum command diakses
require('./database/db');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel],
});

client.commands = new Collection();
const commandFiles = ['party.js', 'itemAdd.js', 'lootAdd.js'];
for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  client.commands.set(command.data.name, command);
}

client.once('clientReady', () => {
  console.log(`[bot] Login sebagai ${client.user.tag}`);
});

client.on('interactionCreate', interactionCreate);

client.login(config.token);
