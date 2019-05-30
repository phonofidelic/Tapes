const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuid/v4');
const Speaker = require('speaker');

const TMP_DIR = '/tmp';
const FORMAT = 'mp3';
const tmpPath = path.resolve(__dirname, TMP_DIR, `${uuidv4()}.${FORMAT}`);

const tmpFile_writeStream = fs.WriteStream(`.${tmpPath}`);
// rec -c 2 -t mp3
const rec = spawn('rec', [
	// '-r', '44100', 
	// '−b', '16', 
	'-c', '2', 
	'-t', FORMAT, 
	'-'
]); // Command from https://superuser.com/a/583757

const audioIn_readStream = rec.stdout;
 
// Example from https://www.npmjs.com/package/audio-speaker
// Create the Speaker instance
const speaker = new Speaker({
  channels: 2,          // 2 channels
  // bitDepth: 16,         // 16-bit samples
  // sampleRate: 44100     // 44,100 Hz sample rate
});
 
// PCM data from stdin gets piped into the speaker
audioIn_readStream
.pipe(tmpFile_writeStream)

const tmpFile_readStream = fs.ReadStream(`.${tmpPath}`);

setTimeout(() => {
	console.log('test')
	tmpFile_readStream
	.pipe(speaker)
}	, 5000)


// OUTPUT: [../deps/mpg123/src/output/coreaudio.c:81] warning: Didn't have any audio data in callback (buffer underflow)



// // Adapted from: https://nodejs.org/en/docs/guides/backpressuring-in-streams/
// const { pipeline } = require('stream');

// const speaker = new Speaker({
//   channels: 2,          // 2 channels
//   bitDepth: 16,         // 16-bit samples
//   sampleRate: 44100     // 44,100 Hz sample rate
// });

// pipeline(
// 	audioIn_readStream,
// 	speaker,
// 	err => {
// 		if (err) {
// 			console.error('Pipeline error:', err)
// 		} else {
// 			console.log('Pipeline succeeded')
// 		}
// 	}
// )

// // OUTPUT: [../deps/mpg123/src/output/coreaudio.c:81] warning: Didn't have any audio data in callback (buffer underflow)



// const speaker = new Speaker({
//   channels: 2,          // 2 channels
//   bitDepth: 16,         // 16-bit samples
//   sampleRate: 44100     // 44,100 Hz sample rate
// });




// // Adapded from: https://github.com/TooTallNate/node-speaker/issues/18#issuecomment-446024020
// let speaker = new Speaker({
//   channels: 1,
//   bitDepth: 16,
//   sampleRate: 16000
// });

// speaker.on('open', () => {
//   console.log('Speaker open');
// })

// speaker.on('flush', () => {
//   console.log('Speaker flush');
// });

// speaker.on('close', () => {
//   console.log('Speaker close');
// });

// speaker.on('data', (data) => {
//   console.log('Speaker data:', data);
// });

// // speaker.write(Buffer.from(new Uint16Array(data)), () => {
// //   speaker.close();
// //   log.info('Speaker data written');
// // });

// audioIn_readStream.pipe(speaker);