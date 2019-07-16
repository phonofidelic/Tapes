const electron = require('electron')
const { 
	ipcMain, 
	dialog 
} = electron;
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const fixPath = require('fix-path');
fixPath();
const { 
	default: installExtension,
	REACT_DEVELOPER_TOOLS,
	REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const isDev = require('electron-is-dev');
const AudioRecorder = require('node-audiorecorder');
const { getAudioDurationInSeconds } = require('get-audio-duration')

const WorkspaceWindow = require('../app/WorkspaceWindow');
const { serveStatic } = require('../app/utils');
const Recording = require('../app/models/Recording');

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

// TODO: Refactor bad global variables?
// let rec; 
let audioRecorder;
let recTimer;
let recording;

function newRecording(renderer, settings) {
	console.log('\n*** newRecording')
	let audioFile_writeStream;

	const id = uuidv4();
	const channels = parseInt(settings.format.channels, 10);
	const fileFormat = settings.format.file
	const recordingFileName = `${id}.${fileFormat}`;
	const savePath = path.resolve(settings.saveDir, recordingFileName);
	
	// console.log('\n*** newRecording, recordingFileName', recordingFileName)
	audioFile_writeStream = fs.WriteStream(savePath);
	
	recording = new Recording({
		title: `${id}.${fileFormat}`,
		format: {
			filetype: fileFormat,
			channels: channels
		},
		filename: recordingFileName,
		src: savePath
	})
	console.log('*** recording:', recording);
	renderer.webContents.send('rec:set_rec_file', recordingFileName)

	const recorderOptions = {
		program: 'rec',
		device: null,
		bits: 16,
		channels: channels,
		encoding: 'unsigned-integer',
		rate: 16000,
  	type: fileFormat,
  	silence: 0,
	};
	audioRecorder = new AudioRecorder(recorderOptions, console);

	audioRecorder.start().stream()
	.pipe(audioFile_writeStream);

	audioRecorder.stream().on(`close`, function(code) {
		console.warn(`Recording closed. Exit code: `, code);
	});
	audioRecorder.stream().on(`end`, function() {
		console.warn(`Recording ended.`);
	});
	audioRecorder.stream().on(`error`, function() {
		console.warn(`Recording error.`);
	});

	audioFile_writeStream.on('close', () => console.log('audioFile_writeStream stream closed'))
	audioFile_writeStream.on('error', (err) => console.log('audioFile_writeStream error:', err))
}

function stopRecording(recorderWindow) {
	console.log('\n*** stop recording, recording:', recording);
	recorderWindow.webContents.send('rec:get_new_recording', recording);
	audioRecorder.stop();
	audioRecorder = undefined;
}

function loadRecordings(recorderWindow, saveDir) {
	fs.readdir(saveDir, (err, files) => {
		if (err) throw err;	// TODO: Handle error
		const recordings = files.filter(file => file !== '.DS_Store'); // Ignore .DS_Store files
		console.log('*** recordings:', recordings);
		recorderWindow.webContents.send('storage:load_recordings_response', recordings)
	});
}

function deleteRecording(path) {
	console.log('\n*** deleteRecording, path:', path);

	fs.unlink(path, err => {
		if (err) throw err;
		console.log('*** deleted:', path)
	})
}

let workspaceWindow; // TODO: remove bad global variables
// let recording; // TODO: remove bad global variables
let server;
async function openWorkspace(recording) {
	console.log('\n*** openWorkspace, recording:', recording);
	// Check if server is already running
	if (!server) server = await serveStatic('/recordings', path.dirname(recording.src), 5000);

	// recording = recording;
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