const electron = require('electron');
const { BrowserWindow } = electron;

class RecorderWindow extends BrowserWindow {
	constructor() {
		super({
			webPreferences: {
	      nodeIntegration: true
	    },
	    width: 300,
	    height: 400,
	    frame: false,
	    resizable: false,
	    show: false,
		});
		// this.on('blur', this.handleBlur.bind(this)); // disable for development
	}

	handleBlur() {
		this.hide();
	}
}

module.exports = RecorderWindow;