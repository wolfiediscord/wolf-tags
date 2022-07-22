const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');

module.exports = class PreviewTagCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'previewtag',
			description: 'Views a tag without showing everyone.',
			dmPermission: false,
			options: [
				{
					name: "title",
					description: "Title of the tag to preview.",
					type: "STRING",
					required: true
				}
			]
		}, {
			guildIds: []
		}
		);
	};

	async chatInputRun(interaction) {
		const title = interaction.options.getString('title');
		// check for spaces in title
		if (/\s/.test(title)) {
			return interaction.reply({content: "<:wolfx:695361329803821086> Invalid title. Do not put spaces in your title.", ephemeral: true });
		};

		// super complicated stuff just to make an array of the tags so we can manage them easier.
		const tagCollection = await this.container.client.db.collection(`${interaction.guildId}`).get();
		let tagDocs = tagCollection.docs;
		let tagArray = [];
		for(let doc of tagDocs) {
			let document = await doc.data();
			tagArray.push(document);
		}
		// now we can check if the tag exists
		// this if statement checks if there are no tags on the server
		if(tagArray.length === 0) {
			return interaction.reply({content: "<:wolfx:695361329803821086> There are no tags on this server. Create some with /createtag!", ephemeral: true});
		}
		// filter out our special tag to view
		let tagtoView;
		tagArray.forEach(tag => {
			if(tag.title === title) {
				tagtoView = tag;
			}
		});
		if(!tagtoView) return interaction.reply({content: "<:wolfx:695361329803821086> The tag you specified does not exist. Create it with /createtag!", ephemeral: true});
		return interaction.reply({content: `${tagtoView.content}`, ephemeral: true, allowedMentions: {parse: []}});

	};
};
