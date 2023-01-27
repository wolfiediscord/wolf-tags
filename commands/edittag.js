const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');
const { ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class EditTagCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'edittag',
			description: 'Edits a tag. You must own the tag in order to edit it.',
			dmPermission: false,
			options: [
				{
					name: "title",
					description: "Title of the tag you want to edit.",
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
		const id = uuidv4();
		const editModal = new ModalBuilder()
			.setCustomId(id)
			.setTitle(`Edit Tag "${title}"`)
		const contentInput = new TextInputBuilder()
			.setCustomId("content")
			.setLabel("New Content")
			.setPlaceholder("You have 5 minutes before submitting is cancelled.")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);
		const contentAR = new ActionRowBuilder().addComponents([contentInput]);
		editModal.addComponents([contentAR]);
		await interaction.showModal(editModal);
		const filter = (modal) => modal.customId = id;
		interaction.awaitModalSubmit({ filter, time: 300000 })
			.then(async modal => {
				// now we can finally edit the tag
				const content = modal.fields.getTextInputValue("content")
                		try {
                        		await this.container.client.db.collection(`${modal.guildId}`).doc(`${tagtoEdit.id}`).update({
                                	content: `${content}`
                        		});
                        		return modal.reply({ content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully modified!`});
                		} catch(err) {
                        		this.container.logger.error(err);
                        		return modal.reply({ content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
                }
			})
			.catch()
	};
};
