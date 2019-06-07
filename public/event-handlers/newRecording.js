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
const soxPath = require('sox-bin');

const command = soxPath + ' --version';
exec(command, (err, stdout) => {
	if (err) throw err;
	console.log('### sox version:', stdout.toString())
})

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

function newRecording(renderer, saveDir) {
	console.log('\n*** start rec, saveDir:', saveDir)
	// Prep path for tmp audio file...								*** TODO: Move to helper function (or remove?)
	// tmpPath = path.resolve(__dirname, '..' , TMP_DIR);
	tmpFile = `${uuidv4()}.${FORMAT}`
	// tmpFilePath = path.resolve(tmpPath, tmpFile)
	// console.log('tmpFile:', tmpFilePath)

	// Send tmpFile path to client
	// renderer.webContents.send('rec:tmpFile', tmpFilePath);


	// // Check for tmp directory. If none exists, create one.
	// fs.readdir(tmpPath, (err, files) => {
	// 	if (err){
	// 		if (err.code === 'ENOENT') {
	// 			console.log(`*** No tmp directory found at '${tmpPath}'. \n*** Creating new tmp directory...`);
	// 			return fs.mkdir(tmpPath, err => {
	// 				if (err) throw err;
	// 				console.log(`*** New tmp directory created at '${tmpPath}'.`);
	// 			});
	// 		}
	// 		throw err;
	// 	}
	// 	console.log('rec:start, files:', files)
	// })
	
	// ...then create tmpFile_writeStream.	
	// tmpFile_writeStream = fs.WriteStream(tmpFilePath);
	console.log('\n*** path.resolve(saveDir, tmpFile):', path.resolve(saveDir, tmpFile))
	tmpFile_writeStream = fs.WriteStream(path.resolve(saveDir, tmpFile));

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
