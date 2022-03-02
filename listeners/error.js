const { Listener } = require('@sapphire/framework');

module.exports = class ErrorListener extends Listener {
	constructor(context, options) {
	super(context, {
	...options,
	event: 'error'
	});
	}
	run(error) {
		this.container.logger.error(`[ERR] ${error}`);
	}
};
