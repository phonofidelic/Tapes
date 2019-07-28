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
	    height: 560,
	    minWidth: 530,
	    minHeight: 560,
	    titleBarStyle: 'hiddenInset',
		});
	}
}

module.exports = WorkspaceWindow;