const { spawn } = require('child_process');
const path = require('path');
const mic = require('mic');
const electron = require('electron')
const { ipcMain } = electron;

const openDirSelect = require('./openDirSelect');
const newRecording = require('./newRecording');

let micInstance;

function stopRecording() {
	console.log('\n*** stopRecording')
	rec.kill(0);
	rec = undefined;
}

function startMonitor() {
	console.log('\n*** Monitor started.')
	monitor = spawn('node', [path.resolve(__dirname, '..', 'monitor.js')])

	monitor.stdout.pipe(process.stdout)
}

function stopMonitor() {
	console.log('\n*** stopMonitor')
	monitor.kill();
	monitor = undefined;
}

module.exports = {
	openDirSelect,
	newRecording,
	stopRecording,
	startMonitor,
	stopMonitor
}