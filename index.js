const electron = require('electron');
const {
	exec,
	spawn
} = require('child_process');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
// const dataurl = require('dataurl');
const Datauri = require('datauri');
const datauri = new Datauri();
const AudioRecorder = require('node-audiorecorder');

const RecorderTray = require('./app/RecorderTray');
const RecorderWindow = require('./app/RecorderWindow');

const {
	openDirSelect,
	newRecording,
	startMonitor,
	stopMonitor
} = require('./event-handlers');

const { 
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
	REDUX_DEVTOOLS
} = require('electron-devtools-installer');

const {
	app,
	BrowserWindow,
	ipcMain,
	dialog
} = electron;

let rec;
// let monitor;
// let audioIn_readStream;

let recorderWindow;
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

ipcMain.on('start_rec', () => newRecording(ipcMain))
ipcMain.on('open_dir_select', () => openDirSelect(recorderWindow))

ipcMain.on('stop_rec', (e) => {
	console.log('stop_rec')
	// audioIn_readStream.unpipe();
	// audioIn_readStream = undefined;
	// tmpFile_writeStream = undefined;
	rec.kill(0);
	// fs.copyFile(tmpPath, savePath, err => {
	// 	if (err) throw err;
	// 	console.log(`*** file saved to ${savePath}`);
	// })
	// audioRecorder.stop();
})

ipcMain.on('monitor:start', () => startMonitor())
// ipcMain.on('monitor:stop', () => stopMonitor())

