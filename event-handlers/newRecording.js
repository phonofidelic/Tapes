const electron = require('electron');
const {
	exec,
	spawn
} = require('child_process');
const fs = require('fs');
const path = require('path');

const uuidv4 = require('uuid/v4');
const Datauri = require('datauri');
const datauri = new Datauri();

const { ipcMain } = electron;

// console.log(path.relative('./', ))
/***
 *	Receive 'rec:start' signal from client:
 *
 *	@newRecording:
 *	# Prep for tmp dir.
 *	# Create tmpFile_writeStream to tmp file in tmp dir.
 *	# Start child process with 'rec' command.
 *	# Create audioIn_readStream from child process stdout
 *		and pipe to tmpFile_writeStream.
 */
let audioIn_readStream;
let tmpFile_writeStream;
let tmpPath;
const TMP_DIR = 'tmp';
const FORMAT = 'flac';

function newRecording(renderer) {
	console.log('start rec')
	// Prep path for tmp audio file...								*** TODO: Move to helper function ***
	tmpPath = path.resolve(__dirname, '..' , TMP_DIR);
	tmpFile = path.resolve(tmpPath, `${uuidv4()}.${FORMAT}`)
	console.log('tmpFile:', tmpFile)
	// Check for tmp directory. If none exists, create one.
	fs.readdir(tmpPath, (err, files) => {
		if (err){
			if (err.code === 'ENOENT') {
				console.log(`*** No tmp directory found at '${tmpPath}'. \n*** Creating new tmp directory...`);
				return fs.mkdir(tmpPath, err => {
					if (err) throw err;
					console.log(`*** New tmp directory created at '${tmpPath}'.`);
				});
			}
			throw err;
		}
		console.log('rec:start, files:', files)
	})
	
	// ...then create tmpFile_writeStream.	
	tmpFile_writeStream = fs.WriteStream(tmpFile);

	// Execute rec and pipe output to stdout, then create audioIn_readStream from stout.
	rec = spawn('rec', [
		'-c', '1',				// One chanel mono 
		'-t', FORMAT, 		// Set format
		'-'								// Pipe to stdout
	]); // Command from https://superuser.com/a/583757
	audioIn_readStream = rec.stdout;

	audioIn_readStream
	.pipe(tmpFile_writeStream);
}

module.exports = newRecording;
