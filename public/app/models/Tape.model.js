const uuidv4 = require('uuid/v4');

class Tape {
	constructor(options) {
		this.id = uuidv4();
		this.created = Date.now();
		this.updated = Date.now();
		this.recording = options.recording;
		this.start: options.start;
		this.end: options.end;
		this.name = options.title || 'New Tape';
		this.tags: options.taggs || [];
		this.description: options.description || 'No descriptoin provided';
	}
}

module.exports = Tape;