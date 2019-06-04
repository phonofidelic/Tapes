const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const mic = require('mic');

const electron = require('electron')
const { ipcMain } = electron;

const openDirSelect = require('./openDirSelect');
const newRecording = require('./newRecording');

const { Transform, PassThrough } = require('stream');

const CHANNEL_COUNT = 1;
const SAMPLE_RATE = 44100;
const BIT_DEPTH = 16;

const dbAnalyser = (recorderWindow) => {

	return new Transform({
		// objectMode: true,
		transform: (chunk, encoding, callback) => {
			let data
			const chunkString = chunk.toString('utf8')
			const start = chunkString.match('Out:')
			const end = chunkString.match('k')

			if(start && end) {
				data = chunkString.substring(start.index+4, end.index)	
			}
			
			// console.log('*** dbAnalyser, chunk:', chunk)
			// Send cunk to renderer?
			recorderWindow.send('monitor:bufferdata', chunk)
			callback(null, chunk)
		}
	})
}

function stopRecording(e, saveDir, tmpFile) {
	console.log('\n*** stop recording')
	console.log('*** saveDir:', saveDir)
	console.log('*** tmpFile:', tmpFile)
	rec.kill();
	rec = undefined;

	// fs.copyFile(tmpFile, saveDir, err => {
	// 	 if (err) throw err; // TODO: Handle error
	// 	 	console.log(`*** New recording saved to ${saveDir}`)
	// })
}


function startMonitor(recorderWindow) {

	micInstance = mic({
    rate: `${SAMPLE_RATE}`,
    channels: `${CHANNEL_COUNT}`,
    // debug: true
    // exitOnSilence: 6
	});
	const micInputStream = micInstance.getAudioStream();

	console.log('\n*** Monitor started.')
	monitor = spawn('node', [path.resolve(__dirname, '..', 'monitor.js')])
	console.log('*** monitor pid:', monitor.pid)

	micInputStream
	.pipe(dbAnalyser(recorderWindow))
	.pipe(monitor.stdin)
	// monitor.stdout


	micInstance.start()
}

function stopMonitor() {
	console.log('\n*** stopMonitor')
	monitor.kill();
	monitor = undefined;

	micInstance.stop();
	micInstance = undefined;
}

module.exports = {
	openDirSelect,
	newRecording,
	stopRecording,
	startMonitor,
	stopMonitor
}