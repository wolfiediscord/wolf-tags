const { SapphireClient, LogLevel } = require('@sapphire/framework');
require('dotenv').config() // configuration file
require('@sapphire/plugin-logger/register');
const admin = require("firebase-admin");
const serviceAccount = require('./firebase.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

class WolfClient extends SapphireClient {
	constructor() {
		super({
			intents: ['GUILDS', 'GUILD_MESSAGES'],
			logger: { level: LogLevel.Debug },
		})
		this.db = db;
	}
};

const client = new WolfClient;

client.login(process.env.TOKEN);
