const { SapphireClient, LogLevel } = require('@sapphire/framework');
require('dotenv').config() // configuration file
require('@sapphire/plugin-logger/register');

const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES'],
	logger: { level: LogLevel.Debug }
});

client.login(process.env.TOKEN);
