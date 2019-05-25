const electron = require('electron');
const {
	exec,
	spawn
} = require('child_process');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

const RecorderTray = require('./app/RecorderTray');
const RecorderWindow = require('./app/RecorderWindow');

const TMP_DIR = '/tmp';

const {
	app,
	BrowserWindow,
	ipcMain
} = electron;

let recorderWindow;
// let rec;
let tray;

app.on('ready', () => {
	recorderWindow = new RecorderWindow();
	recorderWindow.loadURL(`http://localhost:3000`)
	const iconName = 'icon@2x.png';
	const iconPath = path.join(__dirname, `./src/assets/${iconName}`)
	tray = new RecorderTray(iconPath, recorderWindow);
});

/***
 *	Receive 'start_rec' signal from client:
 *
 *	@startRecording:
 *	# Prep for tmp dir.
 *	# Create writeStream to tmp file in tmp dir.
 *	# Start child process with 'rec' command.
 *	# Create readStream from child process stdout.
 */
ipcMain.on('start_rec', () => startRecording())

const startRecording = () => {
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
	
	// Prep path for tmp audio file, then create writeStream.
	const FORMAT = 'flac';
	const destPath = path.resolve(__dirname, TMP_DIR, `${uuidv4()}.${FORMAT}`);
	const writeStream = fs.WriteStream(`.${destPath}`);

	// Execute rec and pipe output to stdout, then create readStream from stout.
	const rec = spawn('rec', ['-c', '1', '-t', FORMAT, '-']);
	const readStream = rec.stdout;	
	
	readStream.pipe(writeStream);
	readStream.on('data', data => {
		// console.log('data:', data)
		// TODO: process audio data and send to client for visualization
	})
	writeStream.on('close', () => console.log('\n*** Done!'))
	ipcMain.on('stop_rec', () => rec.kill(0))
}


