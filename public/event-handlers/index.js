const electron = require('electron')
const { 
	ipcMain, 
	dialog 
} = electron;
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const uuidv4 = require('uuid/v4');
const fixPath = require('fix-path');
fixPath();
const { 
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
	REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const isDev = require('electron-is-dev');
// const Datauri = require('datauri');
// const datauri = new Datauri();

const WorkspaceWindow = require('../app/WorkspaceWindow');
const { serveStatic } = require('../app/utils');

function openDirSelect(renderer) {
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}, (paths) => {
		if (!paths) {
			renderer.webContents.send('settings:select_dir_cancel')
			return console.log('*** No path selected.');
		}
		console.log('*** Selected directory:', paths[0])
		renderer.webContents.send('settings:select_dir', paths[0])
	})
}

let rec; //	<-- TODO: Refactor bad global variable?
function newRecording(renderer, settings) {
	let audioIn_readStream;
	let audioFile_writeStream;
	const FORMAT = 'mp3';

	recordingFileName = `${uuidv4()}.${settings.format.file}`
	console.log('\n*** newRecording, settings.format.chanels', parseInt(settings.format.chanels, 10))
	audioFile_writeStream = fs.WriteStream(path.resolve(settings.saveDir, recordingFileName));
	
	renderer.webContents.send('rec:set_rec_file', recordingFileName)

	// Execute rec and pipe output to stdout, then create audioIn_readStream from stout.
	rec = spawn(
		'rec', 
		[
			'-c', parseInt(settings.format.chanels, 10),
			'-t', settings.format.file, 		// Set format
			'-'								// Pipe to stdout
		],
	); // Command from https://superuser.com/a/583757

	audioIn_readStream = rec.stdout;

	audioIn_readStream
	.pipe(audioFile_writeStream);
}

function stopRecording(e) {
	console.log('\n*** stop recording')
	rec.kill();
	rec = undefined;
}

function loadRecordings(recorderWindow, saveDir) {
	fs.readdir(saveDir, (err, files) => {
		if (err) throw err;	// TODO: Handle error
		const recordings = files.filter(file => file !== '.DS_Store'); // Ignore .DS_Store files
		console.log('*** recordings:', recordings);
		recorderWindow.webContents.send('storage:loadRecordings:response', recordings)
	});
}

function deleteRecording(path) {
	console.log('\n*** deleteRecording');

	fs.unlink(path, err => {
		if (err) throw err;
		console.log('*** deleted:', path)
	})
}

let workspaceWindow; // TODO: remove bad global variables
let recording; // TODO: remove bad global variables
let server;
async function openWorkspace(recording) {
	console.log('\n*** openWorkspace, recording:', recording);
	// Check if server is already running
	if (!server) server = await serveStatic('/recordings', path.dirname(recording.src), 5000);

	recording = recording;
	workspaceWindow = new WorkspaceWindow();
	// workspaceWindow.loadURL(isDev ? `http://localhost:3000/open/${recording.id}` : `file://${path.join(__dirname, "../index.html/open/${recording.id")}`)
	workspaceWindow.loadURL(isDev ? `http://localhost:3000?view=workspace&id=${recording.id}` :`file://${path.join(__dirname, `../index.html?view=workspace&id=${recording.id}`)}`)
	isDev && workspaceWindow.webContents.openDevTools({mode: 'detach'});

	installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension: ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  installExtension(REDUX_DEVTOOLS)
  .then((name) => console.log(`Added Extension: ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  installExtension('cmhomipkklckpomafalojobppmmidlgl')
  .then(name => console.log(`Added Extension: ${name}`))
  .catch(err => console.log('An error occurred: ', err));
}

module.exports = {
	openDirSelect,
	newRecording,
	stopRecording,
	loadRecordings,
	deleteRecording,
	openWorkspace,
}