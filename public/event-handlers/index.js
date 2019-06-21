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
const Datauri = require('datauri');
const datauri = new Datauri();

const WorkspaceWindow = require('../app/WorkspaceWindow');

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
function newRecording(renderer, saveDir) {
	let audioIn_readStream;
	let audioFile_writeStream;
	const FORMAT = 'mp3';

	recordingFile = `${uuidv4()}.${FORMAT}`
	console.log('\n*** newRecording')
	console.log('*** path.resolve(saveDir, recordingFile):', path.resolve(saveDir, recordingFile))
	audioFile_writeStream = fs.WriteStream(path.resolve(saveDir, recordingFile));
	renderer.webContents.send('rec:set_rec_file', recordingFile)

	// Execute rec and pipe output to stdout, then create audioIn_readStream from stout.
	rec = spawn(
		'rec', 
		[
			'-c', '1',				// One chanel mono 
			'-t', FORMAT, 		// Set format
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
function openWorkspace(recording) {
	console.log('\n*** openWorkspace, recording:', recording)
	recording = recording;
	workspaceWindow = new WorkspaceWindow();
	workspaceWindow.loadURL(isDev ? `http://localhost:3000/open/${recording.id}` : `file://${path.join(__dirname, "../build/index.html")}`)
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

function audioStream(srcPath) {
	console.log('\n*** wrk:requestAudioBuffer, srcPath:', srcPath)

	// fs.copyFile(srcPath, path.resolve(__dirname, '..', 'tmp'), (err) => {
	//   if (err) throw err;
	//   console.log('source.txt was copied to destination.txt');
	// });

	datauri.encode(srcPath, (err, content) => {
		if (err) throw err;
		// console.log('\n*** datauri:', content)
		workspaceWindow.webContents.send('wrk:audioBuffer', content)		
	})

	// fs.readFile(srcPath, (err, data) => {
	// 	if (err) throw err;
	// 	// console.log(data)

	// 	workspaceWindow.webContents.send('wrk:audioBuffer', data)
	// })
}

module.exports = {
	openDirSelect,
	newRecording,
	stopRecording,
	loadRecordings,
	deleteRecording,
	openWorkspace,
	audioStream
}