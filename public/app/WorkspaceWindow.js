const electron = require('electron');
const { BrowserWindow } = electron;

class WorkspaceWindow extends BrowserWindow {
	constructor() {
		super({
			webPreferences: {
	      nodeIntegration: true
	    },
	    width: 1250,
	    height: 600,
	    // frame: false,
	    titleBarStyle: 'hidden',
	    resizable: true,
	    show: true,
		});
	}
}

module.exports = WorkspaceWindow;