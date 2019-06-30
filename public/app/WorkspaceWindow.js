const electron = require('electron');
const { BrowserWindow } = electron;

class WorkspaceWindow extends BrowserWindow {
	constructor() {
		super({
			webPreferences: {
	      nodeIntegration: true,
	      // webSecurity: false
	    },
	    width: 1250,
	    height: 370,
	    minWidth: 500,
	    minHeight: 370,
	    titleBarStyle: 'hiddenInset',
		});
	}
}

module.exports = WorkspaceWindow;