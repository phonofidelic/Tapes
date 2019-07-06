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
const { serveStatic } = require('./app/utils');

const {
	openDirSelect,
	newRecording,
	stopRecording,
	loadRecordings,
	deleteRecording,
	openWorkspace,
	audioStream
} = require('./event-handlers');

const { 
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
	REDUX_DEVTOOLS
} = require('electron-devtools-installer');


const {
	app,
	BrowserWindow,
	dialog,
	ipcMain,
	Menu
} = electron;

let recorderWindow;
let tray;
let server;

app.on('ready', async () => {
	// if (!server) server = await serveStatic('/', path.join(__dirname, '../build'), 5001);

	recorderWindow = new RecorderWindow();
	recorderWindow.loadURL(isDev ? `http://localhost:3000` : `file://${path.join(__dirname, "index.html")}`);
	// recorderWindow.loadURL(isDev ? `http://localhost:3000` : `http://localhost:5001`);
	isDev && recorderWindow.webContents.openDevTools({mode: 'detach'});
	const iconName = 'icon@16.png';
	const iconPath = path.join(__dirname, `../src/assets/${iconName}`);
	tray = new RecorderTray(iconPath, recorderWindow);

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

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

const menuTemplate = [
	{
		label: 'Tapes',
		submenu: [
			{ 
				label: 'Quit Tapes',
				role: 'quit'
			}
		]
	}
]

ipcMain.on('rec:start', (e, saveDir) => newRecording(recorderWindow, saveDir));
ipcMain.on('rec:stop', (e) => stopRecording(recorderWindow));
ipcMain.on('rec:open', (e, recording) => openWorkspace(recording));

ipcMain.on('settings:open_dir_select', () => openDirSelect(recorderWindow));
ipcMain.on('storage:loadRecordings', (e, saveDir) => loadRecordings(recorderWindow, saveDir));
ipcMain.on('storage:delete', (e, path) => deleteRecording(path));

process.on('beforeExit', () => {
	console.log('\n*** process beforeExit')
})
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});