const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const electron = require('electron')
const { 
	ipcMain, 
	dialog 
} = electron;

const uuidv4 = require('uuid/v4');
const fixPath = require('fix-path');
fixPath();

function openDirSelect(renderer) {
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}, (paths) => {
		if (!paths) {
			renderer.webContents.send('settings:select_dir_cancel')
			return console.log('*** No path selected.');
		}
		console.log('*** Selected directory:', paths[0])
		renderer.webContents.send('settings:select_dir', paths[0])
	})
}


let rec; //	<-- TODO: Refactor bad global variable?
function newRecording(renderer, saveDir) {
	let audioIn_readStream;
	let tmpFile_writeStream;
	let tmpPath;
	const TMP_DIR = 'tmp';
	const FORMAT = 'flac';

	recordingFile = `${uuidv4()}.${FORMAT}`
	console.log('\n*** newRecording')
	console.log('*** path.resolve(saveDir, recordingFile):', path.resolve(saveDir, recordingFile))
	tmpFile_writeStream = fs.WriteStream(path.resolve(saveDir, recordingFile));
	renderer.webContents.send('rec:set_rec_file', recordingFile)

	// Execute rec and pipe output to stdout, then create audioIn_readStream from stout.
	rec = spawn(
		'rec', 
		[
			'-c', '1',				// One chanel mono 
			'-t', FORMAT, 		// Set format
			'-'								// Pipe to stdout
		],
	); // Command from https://superuser.com/a/583757

	audioIn_readStream = rec.stdout;

	audioIn_readStream
	.pipe(tmpFile_writeStream);
}

function stopRecording(e) {
	console.log('\n*** stop recording')
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