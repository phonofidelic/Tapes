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
 *	Receive 'start_rec' signal from client:
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
const FORMAT = 'mp3';


function newRecording(renderer) {
	console.log('start rec')
	tmpPath = path.resolve(__dirname, '..' , TMP_DIR);
	tmpFile = path.resolve(tmpPath, `${uuidv4()}.${FORMAT}`)
	// tmpPath = path.join('..', tmpPath);
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
		console.log('start_rec, files:', files)
	})
	
	// Prep path for tmp audio file, then create tmpFile_writeStream.
	
	
	tmpFile_writeStream = fs.WriteStream(tmpFile);

	// Execute rec and pipe output to stdout, then create audioIn_readStream from stout.
	rec = spawn('rec', [
		'-c', '1',				// One chanel mono 
		'-t', FORMAT, 		// Set format
		'-'								// Pipe to stdout
	]); // Command from https://superuser.com/a/583757
	audioIn_readStream = rec.stdout;

	play = spawn('play', [tmpPath])

	// datauri
	// .on('error', (err) => console.log('*** datauri error:', err))
	// .on('encoded', content => console.log('*** datauri encoded:', content))
	// .on('data', data => console.log('*** datauri data:', data))
	// .on('end', data => console.log('*** datauri ended:'))

	// audioIn_readStream
	// .on('error', (err) => console.log('*** audioIn_readStream error:', err))
	// .on('open', () => console.log('*** audioIn_readStream open.')) 						// Nope
	// .on('ready', () => console.log('*** audioIn_readStream ready.')) 					// Nope
	// .on('data', data => {
	// 	// TODO: process audio data and send to client for visualization
	// 	// console.log('*** audioIn_readStream data:', data)
	// 	// renderer.webContents.send('rec_audio_data', data)
	// })
	// .on('end', () => console.log('*** audioIn_readStream ended.'))						// Nope

	// tmpFile_writeStream
	// .on('error', (err) => console.log('*** tmpFile_writeStream error:', err))
	// .on('open', () => console.log('*** tmpFile_writeStream open.'))
	// .on('ready', () => {
	// 	console.log('*** tmpFile_writeStream ready.')
	// 	// datauri.encode(`.${tmpPath}`);
	// 	// renderer.webContents.send('rec_audio_data', datauri.format('.mp3', `.${tmpPath}`))
	// })
	// .on('end', () => console.log('*** Done!'));															// Nope

	audioIn_readStream
		.pipe(tmpFile_writeStream);
}

module.exports = newRecording;
