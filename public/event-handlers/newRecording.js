const electron = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const uuidv4 = require('uuid/v4');
const soxPath = require('sox-bin');

const { ipcMain } = electron;

let audioIn_readStream;
let tmpFile_writeStream;
let tmpPath;
const TMP_DIR = 'tmp';
const FORMAT = 'flac';

function newRecording(renderer, saveDir) {
	recordingFile = `${uuidv4()}.${FORMAT}`
	console.log('\n*** newRecording')
	console.log('*** path.resolve(saveDir, recordingFile):', path.resolve(saveDir, recordingFile))
	tmpFile_writeStream = fs.WriteStream(path.resolve(saveDir, recordingFile));

	// Execute rec and pipe output to stdout, then create audioIn_readStream from stout.
	rec = spawn(soxPath, [
		'-d',
		'-c', '1',				// One chanel mono 
		'-t', FORMAT, 		// Set format
		'-'								// Pipe to stdout
	]); // Command from https://superuser.com/a/583757

	audioIn_readStream = rec.stdout;

	audioIn_readStream
	.pipe(tmpFile_writeStream);
}

module.exports = newRecording;
