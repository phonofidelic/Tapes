const fs = require('fs');
const { pipeline } = require('stream');
const { Duplex, Transform } = require('stream');
const { spawn } = require('child_process');

const mic = require('mic');
const Speaker = require('speaker');
const AudioBufferList = require('audio-buffer-list')
const AudioBuffer = require('audio-buffer')


// /*** mic: https://www.npmjs.com/package/mic ***
//  *
//  *	Events:
//  *		data,
//  *		error,
//  *		startComplete,
//  *		stopComplete,
//  *		resumeComplete,
//  * 		silence,
//  *		processExitComplete
//  *
//  ***/
// const micInstance = mic({
//     rate: '44100',
//     channels: '2',
//     // debug: true,
//     fileType: 'mp3'
//     // exitOnSilence: 6
// });
// const micInputStream = micInstance.getAudioStream();
 
// const outputFileStream = fs.WriteStream('./tmp/output.mp3');


// /*** speaker: https://www.npmjs.com/package/speaker ***
//  *
//  ***/
// const speaker = new Speaker({
//   channels: 2,          // 2 channels
//   bitDepth: 16,         // 16-bit samples
//   sampleRate: 44100     // 44,100 Hz sample rate
// });


// const audioBufferList = new AudioBufferList()


// /*** audio-buffer: https://www.npmjs.com/package/audio-buffer
//  *
//  ***/
// const audioBuffer = new AudioBuffer({ numberOfChannel: 2 })


// micInputStream
// // .pipe(audioBuffer)
// .pipe(speaker);


// micInputStream.on('error', function(err) {
//     console.log("Error in Input Stream: " + err);
// });

// micInputStream.on('data', function(data) {
//     console.log("Recieved Input Stream: " + data.length);
//     audioBuffer.write(data)
// });

// micInstance.start();




/***********************************************************************/

// const CHANNELS = 1;

// /*** mic: https://www.npmjs.com/package/mic ***
//  *
//  ***/
// const micInstance = mic({
//     rate: '44100',
//     channels: `${CHANNELS}`,
//     // debug: true,
//     fileType: 'mp3'
//     // exitOnSilence: 6
// });
// const micInputStream = micInstance.getAudioStream();

// ** speaker: https://www.npmjs.com/package/speaker ***
//  *
//  **
// const speaker = new Speaker({
//   channels: CHANNELS,          // 2 channels
//   bitDepth: 16,         // 16-bit samples
//   sampleRate: 44100     // 44,100 Hz sample rate
// });



// class Monitor extends Transform {
// 	constructor(source, options){
// 		console.log('### source:', source)
// 		super(options);
// 		this.audioBufferList = undefined;
// 	}

	// _write(chunk, encoding, callback) {
	// 	// console.log('\n*** write chunk.length', chunk.length)
	// 	// console.log('*** write chunk', chunk)
	// 	// const audioBuffer = new AudioBuffer(null, {
	// 	// 	length: chunk.length,
	// 	// 	numberOfChannels: 2 
	// 	// });
	// 	// audioBuffer.copyToChannel(chunk, 0, 0) // Incorrect implementation?

	// 	// if (this.audioBufferList === undefined) {
	// 	// 	this.audioBufferList = new AudioBufferList(audioBuffer, { numberOfChannels: 2 });
	// 	// } else {
	// 	// 	this.audioBufferList.append(audioBuffer);
	// 	// }
	// 	// console.log('\n*** write audioBuffer.length:', audioBuffer.length);
	// 	// console.log('\n*** write audioBufferList:', this.audioBufferList);

	// 	// // console.log('\n*** this:', this);
	// 	// // callback();


	// /**********************************************************/


// 	// 	if (Buffer.isBuffer(chunk)) {
// 	// 		console.log('\n*** _write, chunk is Buffer:', chunk);
// 	// 		// Convert current chunk to AudioBuffer
// 	// 		const audioBuffer = new AudioBuffer(null, {
// 	// 			length: chunk.length,
// 	// 			numberOfChannels: 2 
// 	// 		});
// 	// 		audioBuffer.copyToChannel(chunk, 0, 0) // Incorrect implementation?
// 	// 		if (this.audioBufferList === undefined) {
// 	// 			console.log('\n*** _write, audioBufferList is undefined')
// 	// 			console.log('*** creating new audioBufferList...')
// 	// 			this.audioBufferList = new AudioBufferList(audioBuffer, { numberOfChannels: 2 });
// 	// 		} else {
// 	// 			console.log('\n*** _write, audioBufferList exists')
// 	// 			console.log('*** adding current audioBuffer to audioBufferList...')
// 	// 			this.audioBufferList.append(audioBuffer);	// BUG: monitor is only being run once, so this is never called
// 	// 		}
// 	// 		console.log('\n*** _write audioBuffer.length:', audioBuffer.length);
// 	// 		console.log('***\n*** _write audioBufferList.length:', this.audioBufferList.length);
// 	// 	}
// 	// }
	
// 	// _read(size) {
// 	// 	console.log('*** _read size', size)

// 	// 	// console.log('\n*** read audioBuffer:', audioBuffer);
// 	// 	console.log('\n*** _read audioBufferList:', this.audioBufferList);
// 	// }

// 	_transform(chunk, encodingm, callback) {
// 		console.log('\n*** _transform, chunk:', chunk)
// 		this.push(chunk)
// 		// Convert current chunk to AudioBuffer
// 		const audioBuffer = new AudioBuffer(null, {
// 			length: chunk.length,
// 			numberOfChannels: CHANNELS 
// 		});
// 		audioBuffer.copyToChannel(chunk, 0, 0) // Incorrect implementation?
// 		// audioBuffer.write(chunk)

// 		if (this.audioBufferList === undefined) {
// 			console.log('\n*** _transform, audioBufferList is undefined')
// 			console.log('*** creating new audioBufferList...')
// 			this.audioBufferList = new AudioBufferList(audioBuffer, { numberOfChannels: CHANNELS });
// 		} else {
// 			console.log('\n*** _transform, audioBufferList exists')
// 			console.log('*** adding current audioBuffer to audioBufferList...')
// 			this.audioBufferList.append(audioBuffer);	// BUG: monitor is only being run once, so this is never called
// 		}

// 		console.log('\n*** _transform, audioBuffer:', this.audioBufferList.length)
// 		// this.write(this.audioBufferList)
// 		// console.log('\n*** Transform Stream:', this)
// 		callback()
// 	}
// }

// const monitor = new Monitor()


// // micInputStream.on('data', data => console.log('### micInputStream, data:', data))
// micInputStream.on('error', err => console.log('### micInputStream, error:', err))
// micInputStream.on('startComplete', () => console.log('### startComplete'))
// micInputStream.on('stopComplete', () => console.log('### stopComplete'))
// micInputStream.on('pauseComplete', () => console.log('### pauseComplete'))
// micInputStream.on('resumeComplete', () => console.log('### resumeComplete'))
// micInputStream.on('silence', () => console.log('### silence'))
// micInputStream.on('processExitComplete', () => console.log('### processExitComplete'))

// // monitor.on('data', data => console.log('### monitor, data:', data))

// speaker.on('end', () => console.log('\n### speaker end'))

// // micInputStream
// // .pipe(monitor)
// // .pipe(speaker);

// pipeline(
// micInputStream,
// monitor,
// speaker,
// (err) => err ? console.error('Pipeline failed:', err) : consoel.log('Pipeline succeeded.')
// )

// micInstance.start();

// // console.log('## micInputStream:', micInputStream)
// // console.log('### monitor:', monitor)

/***********************************************************************/

const FORMAT = 'raw'
const rec = spawn('rec', [
	'-c', '1',				// One chanel mono 
	'-r', '44100',		// Sample rate 16k
	'-b', '16',				// Bit depth 16
	'-t', FORMAT, 		// Set format
	'-'								// Pipe to stdout
]); // Command from https://superuser.com/a/583757
audioIn_readStream = rec.stdout;


var micInstance = mic({
    rate: '44100',
    channels: '1',
    // debug: true
    // exitOnSilence: 6
});
var micInputStream = micInstance.getAudioStream();


// Create the Speaker instance
const speaker = new Speaker({
  channels: 1,          // 2 channels
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100     // 44,100 Hz sample rate
});

// PCM data from stdin gets piped into the speaker
micInputStream.pipe(speaker);

micInstance.start()

