const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'ping',
			description: 'Tells you the bot latency.'
		}, {
			guildIds: []
		}
		);
	};

	async chatInputRun(interaction) {
		let pingEmbed = {
			title: "🏓 Ping",
			description: "Pinging..."
		};
		let msg = await interaction.reply({embeds: [pingEmbed], fetchReply: true});
		let ping = `Pong! Bot Latency: ${Math.round(this.container.client.ws.ping)}ms API Latency: ${msg.createdTimestamp - interaction.createdTimestamp}ms`;
		pingEmbed.description = ping;
		return interaction.editReply({embeds: [pingEmbed]});
	};
};
