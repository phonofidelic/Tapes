const uuidv4 = require('uuid/v4');

class Project {
	constructor(options) {
		this.id = uuidv4();
		this.created = Date.now();
		this.updated = Date.now();
		this.recordings = options.recordings || [];
		this.tapes  = options.tapes || [];
		this.title = options.title || 'New Project';
		this.tags = options.tags || [];
		this.description = options.description || 'No descriptoin provided';
	}
}

module.exports = Project;