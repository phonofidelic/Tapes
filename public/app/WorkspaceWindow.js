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
	    minWidth: 500,
	    minHeight: 300,
	    titleBarStyle: 'hiddenInset',
		});
	}
}

module.exports = WorkspaceWindow;