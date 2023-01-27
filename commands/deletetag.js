const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');

module.exports = class DeleteTagCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'deletetag',
			description: 'Creates a tag.',
			dmPermission: false,
			options: [
				{
					name: "title",
					description: "Title of the tag to delete.",
					type: ApplicationCommandOptionType.String,
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
			let document = await doc.data()
			document.id = doc.id;
			tagArray.push(document);
		}
		// now we can check if the tag exists
		// this if statement checks if there are no tags on the server
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
		if(!alreadyExists) return interaction.reply({content: `<:wolfx:695361329803821086> The tag you specified does not exist.`, ephemeral: true });
		// filter out our special tag
		let tagtoDelete;
		tagArray.forEach(tag => {
			if(tag.title === title) {
				tagtoDelete = tag;
			}
		});
		// permission check
		if(interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			try {
			await this.container.client.db.collection(`${interaction.guildId}`).doc(tagtoDelete.id).delete();
			return interaction.reply({ content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully deleted!`});
		} catch(err) {
			this.container.logger.error(err);
			return interaction.reply({ content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
		}
		}
		if(tagtoDelete.owner_id !== interaction.user.id) return interaction.reply({content: `<:wolfx:695361329803821086> You do not have permission to delete this tag.`, ephemeral: true });
		// now we can finally delete the tag
		try {
			await this.container.client.db.collection(`${interaction.guildId}`).doc(tagtoDelete.id).delete();
			return interaction.reply({ content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully deleted!`});
		} catch(err) {
			this.container.logger.error(err);
			return interaction.reply({ content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
		}
	};
};
