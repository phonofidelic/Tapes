const fs = require('fs');
const path = require('path');

const electron = require('electron')
const { ipcMain } = electron;

const openDirSelect = require('./openDirSelect');
const newRecording = require('./newRecording');

function stopRecording(e, saveDir, tmpFile) {
	console.log('\n*** stop recording')
	console.log('*** saveDir:', saveDir)
	console.log('*** tmpFile:', tmpFile)
	rec.kill();
	rec = undefined;
}

function loadRecordings(recorderWindow, saveDir) {
	fs.readdir(saveDir, (err, files) => {
		if (err) throw err;	// TODO: Handle error
		const recordings = files.filter(file => file !== '.DS_Store'); // Ignore .DS_Store files
		console.log('*** recordings:', recordings);
		recorderWindow.webContents.send('storage:loadRecordings:response', recordings)
	});
}

module.exports = {
	openDirSelect,
	newRecording,
	stopRecording,
	loadRecordings
}