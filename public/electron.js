const electron = require('electron');
const isDev = require('electron-is-dev');
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
	openDirSelect,
	newRecording,
	stopRecording,
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

let recorderWindow;
let tray;

app.on('ready', () => {
	recorderWindow = new RecorderWindow();
	recorderWindow.loadURL(isDev ? `http://localhost:3000` : `file://${path.join(__dirname, "../build/index.html")}`);
	isDev && recorderWindow.webContents.openDevTools({mode: 'detach'});
	const iconName = 'icon@16.png';
	const iconPath = path.join(__dirname, `../src/assets/${iconName}`);
	tray = new RecorderTray(iconPath, recorderWindow);

	installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension: ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  installExtension(REDUX_DEVTOOLS)
  .then((name) => console.log(`Added Extension: ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  installExtension('cmhomipkklckpomafalojobppmmidlgl')
  .then(name => console.log(`Added Extension: ${name}`))
  .catch(err => console.log('An error occurred: ', err));
});

ipcMain.on('rec:start', (e, saveDir) => newRecording(recorderWindow, saveDir))
ipcMain.on('rec:stop', (e, saveDir) => stopRecording(recorderWindow))
ipcMain.on('settings:open_dir_select', () => openDirSelect(recorderWindow))
ipcMain.on('storage:loadRecordings', (e, saveDir) => loadRecordings(recorderWindow, saveDir))

process.on('beforeExit', () => {
	console.lof('\n*** process beforeExit')
})
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});