const electron = require('electron');
const { BrowserWindow } = electron;

class RecorderWindow extends BrowserWindow {
	constructor() {
		super({
			webPreferences: {
	      nodeIntegration: true
	    },
	    width: 300,
	    height: 300,
	    frame: false,
	    resizable: false,
	    show: false,
		});
		this.on('blur', this.handleBlur.bind(this));
	}

	handleBlur() {
		this.hide();
	}
}

module.exports = RecorderWindow;