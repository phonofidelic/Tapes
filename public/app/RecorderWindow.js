const electron = require('electron');
const isDev = require('electron-is-dev');
const { BrowserWindow } = electron;

class RecorderWindow extends BrowserWindow {
	constructor() {
		super({
			webPreferences: {
	      nodeIntegration: true
	    },
	    width: 350,
	    height: 400,
	    frame: false,
	    resizable: false,
	    show: false,
		});
		!isDev && this.on('blur', this.handleBlur.bind(this)); // disable for development
	}

	handleBlur() {
		this.hide();
	}
}

module.exports = RecorderWindow;