const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class CreateTagCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'createtag',
			description: 'Creates a tag.',
		}, {
			guildIds: []
		}
		);
	};

	async chatInputRun(interaction) {
		if(!interaction.guild) return interaction.reply({content: "<:wolfx:695361329803821086> This bot must be used within a server.", ephemeral: true});
		// creating a nice form modal for the creation of tags	
		// UUID is required for ensuring that multiple users can run it at once
		const id = uuidv4();
		const creationModal = new Modal()
			.setCustomId(id)
			.setTitle("Create Tag");
		const titleInput = new TextInputComponent()
			.setCustomId("title")
			.setLabel("Title (do not use spaces)")
			.setStyle("SHORT")
			.setPlaceholder("Title of tag")
			.setRequired(true);
		const contentInput = new TextInputComponent()
			.setCustomId("content")
			.setLabel("Content")
			.setStyle("PARAGRAPH")
			.setPlaceholder("You have 5 minutes before submitting is cancelled.")
			.setRequired(true);
		const titleAR = new MessageActionRow().addComponents([titleInput]);
		const contentAR = new MessageActionRow().addComponents([contentInput]);
		creationModal.addComponents([titleAR, contentAR]);
		await interaction.showModal(creationModal)
		// this waits for the user to submit 
		const filter = (modal) => modal.customId === id;
		interaction.awaitModalSubmit({ filter, time: 300000 })
			.then(async modal => {
				const title = modal.fields.getTextInputValue("title");
				const content = modal.fields.getTextInputValue("content");
				if (/\s/.test(title)) {
                        		return modal.reply({content: "<:wolfx:695361329803821086> Invalid title. Do not put spaces in your title.", ephemeral: true });
                		};
				
                		// super complicated stuff just to make an array of the tags so we can manage them easier.
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
                        		try {
                                		await this.container.client.db.collection(`${modal.guildId}`).add({
                                        	title: `${title}`,
                                        	content: `${content}`,
                                        	owner_id: `${modal.user.id}`,
                                		});
                                		return modal.reply({content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully created!`});
                        		} catch(err) {
                                		this.container.logger.error(err);
                                		return modal.reply({content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
                        }
                }
                		// this checks if there is an already existing tag
                		let alreadyExists = false;
                		tagArray.forEach(tag => {
                        		if(title === tag.title) {
                                		alreadyExists = true;
                        		} 
                		});
                		if(alreadyExists) return modal.reply({ content: `<:wolfx:695361329803821086> A tag already exists with the title \`${title}\`.`, ephemeral: true});
                		// now we can finally create the tag
                		try {
                        		await this.container.client.db.collection(`${interaction.guildId}`).add({
                                		title: `${title}`,
                                		content: `${content}`,
                                		owner_id: `${interaction.user.id}`
                        		});
                        		return modal.reply({ content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully created!`});
                		} catch(err) {
                        		this.container.logger.error(err);
                        		return modal.reply({ content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
                		}
			})
			.catch();
	};
};
