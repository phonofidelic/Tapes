const electron = require('electron');
const {
	app,
	Tray,
	Menu
} = electron;

const APP_NAME = 'Tapes';

class RecorderTray extends Tray {
	constructor(iconPath, recorderWindow) {
		super(iconPath);

		this.recorderWindow = recorderWindow;
		this.setToolTip(APP_NAME);
		this.on('click', this.handleClick.bind(this));
		this.on('right-click', this.handleRightClick.bind(this));
	}

	handleClick(e, bounds) {
		const { x, y } = bounds;
		const { width, height } = this.recorderWindow.getBounds();
		const yPos = process.platform === 'darwin' ? y : y - height;

		if (this.recorderWindow.isVisible()) {
			this.recorderWindow.hide();
		} else {
			this.recorderWindow.setBounds({
				x: x - width / 2,
				y: yPos,
				width,
				height
			});
			this.recorderWindow.show();
		}
	}

	handleRightClick(e, bounds) {
		const menuConfig = Menu.buildFromTemplate(
			[
				{ role: 'quit' }
			]
		);
		this.popUpContextMenu(menuConfig);
	}
}

module.exports = RecorderTray;