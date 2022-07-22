const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');

module.exports = class TagsCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'tags',
			description: 'Lists all of the tags on the server.',
		}, {
			guildIds: []
		}
		);
	};

	async chatInputRun(interaction) {
		if(!interaction.guild) return interaction.reply({content: "<:wolfx:695361329803821086> This bot must be used within a server.", ephemeral: true});
		// super complicated stuff just to make an array of the tags so we can manage them easier.
		let taglistEmbed = {
			title: `Current Tags in ${interaction.guild.name}`
		}
		const tagCollection = await this.container.client.db.collection(`${interaction.guildId}`).get();
		let tagDocs = tagCollection.docs;
		let tagArray = [];
		for(let doc of tagDocs) {
			let document = await doc.data()
			tagArray.push(document);
		}
		// now we can check if the tag exists
		// this if statement checks if there are no tags on the server, and then creates the collection and tag for the server
		if(tagArray.length === 0) {
			taglistEmbed.description = "There are no tags in this server. Use /createtag to make some!";
			return interaction.reply({embeds: [ taglistEmbed ]});
		}
		let tagnameArray = [];
		for(let tag of tagArray) {
			tagnameArray.push(tag.title);
		}
		taglistEmbed.description = tagnameArray.join(', ');
		return interaction.reply({ embeds: [ taglistEmbed ]});

	};
};
