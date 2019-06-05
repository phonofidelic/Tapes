const electron = require('electron');
const isDev = require('electron-is-dev');
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
	stopRecording,
	startMonitor,
	stopMonitor,
	loadRecordings
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

// TODO: Refactor bad global variables
let rec;
let micInstance;
let monitor;

let recorderWindow;
let tray;

app.on('ready', () => {
	recorderWindow = new RecorderWindow();
	recorderWindow.loadURL(isDev ? `http://localhost:3000` : `file://${path.join(__dirname, "../build/index.html")}`);
	recorderWindow.webContents.openDevTools({mode: 'detach'});
	const iconName = 'icon@16.png';
	console.log('\n*** prod iconPath:', `file:/${path.join(__dirname, 'assets', iconName)}`)
	// const iconPath = isDev ? path.join(__dirname, `../src/assets/${iconName}`) : `file:/${path.join(__dirname, 'assets', iconName)}`
	const iconPath = path.join(__dirname, `../src/assets/${iconName}`);
	tray = new RecorderTray(iconPath, recorderWindow);

	installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
});

ipcMain.on('rec:start', (e, saveDir) => newRecording(recorderWindow, saveDir))
ipcMain.on('rec:stop', (e, saveDir, tmpFile) => stopRecording(recorderWindow, saveDir, tmpFile))
ipcMain.on('settings:open_dir_select', () => openDirSelect(recorderWindow))
ipcMain.on('monitor:start', () => startMonitor(recorderWindow))
ipcMain.on('monitor:stop', () => stopMonitor())
ipcMain.on('storage:loadRecordings', (e, saveDir) => loadRecordings(recorderWindow, saveDir))

process.on('beforeExit', () => {
	console.lof('\n*** process beforeExit')
})
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});