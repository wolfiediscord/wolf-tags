const { Listener } = require('@sapphire/framework');

module.exports = class ReadyListener extends Listener {
	constructor(context, options) {
	super(context, {
	...options,
	once: true,
	event: 'ready'
	});
	}
	run(client) {
		const { username, id } = client.user;
		this.container.logger.info(`Ready! Logged in as ${username} (${id})`);
	}
};
