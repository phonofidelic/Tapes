const { spawn } = require('child_process');
const path = require('path');
const mic = require('mic');
const electron = require('electron')
const { ipcMain } = electron;

const openDirSelect = require('./openDirSelect');
const newRecording = require('./newRecording');

let micInstance;


function startMonitor() {
	let monitor;
	console.log('\n*** startMonitor')
	monitor = spawn('node', [path.resolve(__dirname, '..', 'monitor.js')])

	monitor.stdout.pipe(process.stdout)

	ipcMain.on('monitor:stop', () => {
	 	monitor.kill();
	})
}

function stopMonitor() {
	console.log('\n*** stopMonitor')
	monitor.kill();
	monitor = undefined;
}

module.exports = {
	openDirSelect,
	newRecording,
	startMonitor,
	stopMonitor
}