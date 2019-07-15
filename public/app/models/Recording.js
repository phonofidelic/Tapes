const uuidv4 = require('uuid/v4');

class Recording {
	constructor(options) {
		this.id = uuidv4();
		this.created = Date.now();
		this.updated = Date.now();
		this.format = options.format;
		this.title = options.title;
		this.filename = options.filename,
		this.src = options.src
	}
}

module.exports = Recording;