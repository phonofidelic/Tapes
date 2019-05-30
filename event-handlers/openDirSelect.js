const electron = require('electron');

const {
	dialog
} = electron;

function openDirSelect(renderer) {
	console.log('open_dir_select')
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}, (paths) => {
		if (!paths) {
			renderer.webContents.send('select_dir_cancel')
			return console.log('*** No path selected.');
		}
		console.log('*** Selected directory:', paths[0])
		renderer.webContents.send('select_dir', paths[0])
	})
}

module.exports = openDirSelect;