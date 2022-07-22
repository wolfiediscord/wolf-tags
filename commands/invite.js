const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');

module.exports = class InviteCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'invite',
			description: 'Invite the bot to your server!'
		}, {
			guildIds: []
		}
		);
	};

	async chatInputRun(interaction) {
		let inviteEmbed = {
			title: "Invite Wolf Tags",
			description: "[Invite Wolf Tags to your server!](https://discord.com/oauth2/authorize?client_id=888666209787199509&scope=bot%20applications.commands&permissions=0)"
		};
		return interaction.reply({embeds: [inviteEmbed], ephemeral: true});
	};
};
