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

const { 
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
	REDUX_DEVTOOLS
} = require('electron-devtools-installer');



const TMP_DIR = '/tmp';

const {
	app,
	BrowserWindow,
	ipcMain,
	dialog
} = electron;




let recorderWindow;
// let rec;
let tray;

app.on('ready', () => {
	recorderWindow = new RecorderWindow();
	recorderWindow.loadURL(`http://localhost:3000`);
	recorderWindow.webContents.openDevTools({mode: 'detach'});
	const iconName = 'icon@16.png';
	const iconPath = path.join(__dirname, `./src/assets/${iconName}`)
	tray = new RecorderTray(iconPath, recorderWindow);
	installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
});

/***
 *	Receive 'start_rec' signal from client:
 *
 *	@startRecording:
 *	# Prep for tmp dir.
 *	# Create writeStream to tmp file in tmp dir.
 *	# Start child process with 'rec' command.
 *	# Create readStream from child process stdout
 *		and pipe to writeStream.
 */
let readStream;
ipcMain.on('start_rec', () => startRecording())
function startRecording() {
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
	const tmpPath = path.resolve(__dirname, TMP_DIR, `${uuidv4()}.${FORMAT}`);
	const writeStream = fs.WriteStream(`.${tmpPath}`);

	// Execute rec and pipe output to stdout, then create readStream from stout.
	const rec = spawn('rec', ['-c', '1', '-t', FORMAT, '-']); // Command from https://superuser.com/a/583757
	readStream = rec.stdout;	
	
	readStream.pipe(writeStream);
	readStream.on('data', data => {
		// console.log('data:', data)
		// TODO: process audio data and send to client for visualization
	})
	readStream.on('close', () => console.log('### readStream closed'))
	
	writeStream.on('close', () => console.log('\n*** Done!'))
}

ipcMain.on('stop_rec', (e) => stopRecording())
function stopRecording() {
	console.log('stop_rec')
	readStream.unpipe();
	readStream = null;
	// rec.kill(0);
	// fs.copyFile(tmpPath, savePath, err => {
	// 	if (err) throw err;
	// 	console.log(`*** file saved to ${savePath}`);
	// })
}

ipcMain.on('open_dir_select', () => openDirSelect())
function openDirSelect() {
	console.log('open_dir_select')
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}, (paths) => {
		if (!paths) {
			recorderWindow.webContents.send('select_dir_cancel')
			return console.log('*** No path selected.');
		}
		console.log('*** Selected directory:', paths[0])
		recorderWindow.webContents.send('select_dir', paths[0])
	})
}

