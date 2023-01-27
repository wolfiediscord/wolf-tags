const { SapphireClient, LogLevel } = require('@sapphire/framework');
require('dotenv').config() // configuration file
require('@sapphire/plugin-logger/register');
const admin = require("firebase-admin");
const serviceAccount = require('./firebase.json');
const { GatewayIntentBits } = require('discord.js');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

class WolfClient extends SapphireClient {
	constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
			logger: { level: LogLevel.Debug },
		})
		this.db = db;
	}
};

const client = new WolfClient;

client.login(process.env.TOKEN);
