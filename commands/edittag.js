const { SlashCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');

module.exports = class EditTagCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'edittag',
			description: 'Edits a tag. You must own the tag in order to edit it.',
			options: [
				{
					name: "title",
					description: "Title of the tag you want to edit.",
					type: "STRING",
					required: true
				}, {
					name: "content",
					description: "The new content of the tag.",
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
		if(!interaction.guild) return interaction.reply({content: "<:wolfx:695361329803821086> This bot must be used within a server.", ephemeral: true});
		const title = interaction.options.getString('title');
		const content = interaction.options.getString('content');
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
			document.id = doc.id;
			tagArray.push(document);
		}

		// now we can check if the tag exists
		// this if statement checks if there are no tags in the server
		if(tagArray.length === 0) {
			return interaction.reply({content: "<:wolfx:695361329803821086> There are no tags on this server. Create one with /createtag!", ephemeral: true });
		}
		// this checks if there is an already existing tag
		let alreadyExists = false;
		tagArray.forEach(tag => {
			if(title === tag.title) {
				alreadyExists = true;
			} 
		});
		if(!alreadyExists) return interaction.reply({content: `<:wolfx:695361329803821086> The tag you specified does not exist. Create it with /createtag!`, ephemeral: true });
		// filter out our special tag
		let tagtoEdit;
		tagArray.forEach(tag => {
			if(tag.title === title) {
				tagtoEdit = tag;
			}
		});
		// permission check
		if(tagtoEdit.owner_id !== interaction.user.id) return interaction.reply({content: `<:wolfx:695361329803821086> You do not have permission to modify this tag.`, ephemeral: true });

		// now we can finally edit the tag
		try {
			await this.container.client.db.collection(`${interaction.guildId}`).doc(`${tagtoEdit.id}`).update({
				content: `${content}`
			});
			return interaction.reply({ content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully modified!`});
		} catch(err) {
			this.container.logger.error(err);
			return interaction.reply({ content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
		}
	};
};
