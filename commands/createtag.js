const { SlashCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandRegistry, Command } = require('@sapphire/framework');

module.exports = class CreateCommand extends Command {
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand(
		{
			name: 'createtag',
			description: 'Creates a tag.',
			options: [
				{
					name: "title",
					description: "Title of the tag.",
					type: "STRING",
					required: true
				}, {
					name: "content",
					description: "The content of the tag.",
					type: "STRING",
					required: true
				}
			]
		}, {
			guildIds: ['686289422227865609']
		}
		);
	};

	async chatInputRun(interaction) {
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
			let document = await doc.data()
			tagArray.push(document);
		}
		// now we can check if the tag exists
		// this if statement checks if there are no tags on the server, and then creates the collection and tag for the server
		if(tagArray.length === 0) {
			try {
				await this.container.client.db.collection(`${interaction.guildId}`).add({
					title: `${title}`,
					content: `${content}`,
					owner_id: `${interaction.user.id}`,
				});
				return interaction.reply({content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully created!`});
			} catch(err) {
				this.container.logger.error(err);
				return interaction.reply({content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
			}
		}
		// this checks if there is an already existing tag
		let alreadyExists = false;
		tagArray.forEach(tag => {
			if(title === tag.title) {
				alreadyExists = true;
			} 
		});
		if(alreadyExists) return interaction.reply({ content: `<:wolfx:695361329803821086> A tag already exists with the title \`${title}\`.`, ephemeral: true});
		// now we can finally create the tag
		try {
			await this.container.client.db.collection(`${interaction.guildId}`).add({
				title: `${title}`,
				content: `${content}`,
				owner_id: `${interaction.user.id}`
			});
			return interaction.reply({ content: `<:wolfcheckmark:695361282219442286> Tag \`${title}\` successfully created!`});
		} catch(err) {
			this.container.logger.error(err);
			return interaction.reply({ content: `<:wolfx:695361329803821086> An error occured! Please report this to the developers: ${err}`, ephemeral: true });
		}
	};
};
