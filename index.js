const electron = require('electron');
const {
	exec,
	spawn
} = require('child_process');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

const TMP_DIR = '/tmp';

const {
	app,
	BrowserWindow,
	ipcMain
} = electron;

let mainWindow;
let rec;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		webPreferences: {
      nodeIntegration: true
    }
	});
	mainWindow.loadURL(`http://localhost:3000`)
});

/***
 *	Receive 'start_rec' signal from client:
 *	# Prep for tmp dir.
 *	# Create writeStream to tmp file in tmp dir.
 *	# Start child process with 'rec' command.
 *	# Create readStream from child process stdout.
 */
ipcMain.on('start_rec', () => {
	console.log('start rec')
	// Check for tmp directory. If none exists, create one.
	fs.readdir(`${__dirname + TMP_DIR}`, (err, files) => {
		if (err){
			if (err.code === 'ENOENT') {
				console.log(`\n*** No tmp directory found at '${__dirname + TMP_DIR}'. \n*** Creating new tmp directory...`);
				return fs.mkdir(`${__dirname + TMP_DIR}`, err => {
					if (err) throw err;
					console.log(`\n*** New tmp directory created at '${__dirname + TMP_DIR}'.\n`);
				});
			}
			throw err;
		}
		console.log('start_rec, files:', files)
	})
	
	
	const FORMAT = 'flac';
	const destPath = path.resolve(__dirname, TMP_DIR, `${uuidv4()}.${FORMAT}`);
	console.log('destPath', destPath)

	const writeStream = fs.WriteStream(`.${destPath}`);
	// Execute rec and pipe output to stdout, then create readStream from stout.
	const rec = spawn('rec', ['-c', '1', '-t', FORMAT, '-']);
	const readStream = rec.stdout;	
	

	writeStream.on('data', data => {
		console.log('### wtiteStream data:', data)
		// TODO: process audio data and send to client for visualization
	})

	readStream.pipe(writeStream);
	readStream.on('data', data => {
		// console.log('data:', data)
	})
	writeStream.on('close', () => console.log('Done!'))

	ipcMain.on('stop_rec', () => rec.kill())
})



