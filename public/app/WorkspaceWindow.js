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
	    height: 450,
	    minWidth: 530,
	    minHeight: 450,
	    titleBarStyle: 'hiddenInset',
		});
	}
}

module.exports = WorkspaceWindow;