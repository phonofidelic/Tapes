const { spawn } = require('child_process');
const mic = require('mic');
const Speaker = require('speaker');

const CHANNEL_COUNT = 1;
const SAMPLE_RATE = 44100;
const BIT_DEPTH = 16;


const micInstance = mic({
    rate: `${SAMPLE_RATE}`,
    channels: `${CHANNEL_COUNT}`,
    // debug: true
    // exitOnSilence: 6
});

// 'rec -c 1 -b 16 -r 44100 -t raw statTest.raw stat'
// const rec = spawn('rec', [
// 	'-c', '1',
// 	'-b', '16k',
// 	'-r', '44100',
// 	'-e', 'signed-integer',
// 	'-t', 'raw',
// 	'spectrogram',
// 	'-'
// ])
// const monitor = rec.stdout;
// console.log('### rec:', rec)

/*** mic: https://www.npmjs.com/package/mic ***
 *
 *	Events:
 *		data,
 *		error,
 *		startComplete,
 *		stopComplete,
 *		resumeComplete,
 * 		silence,
 *		processExitComplete
 *
 ***/
// const micInputStream = micInstance.getAudioStream();

/*** speaker: https://www.npmjs.com/package/speaker ***
 *
 ***/
// Create the Speaker instance
const speaker = new Speaker({
  channels: CHANNEL_COUNT,          // 1 channels
  bitDepth: BIT_DEPTH,         // 16-bit samples
  sampleRate: SAMPLE_RATE     // 44,100 Hz sample rate
});

// PCM data from stdin gets piped into the speaker
// micInputStream
process.stdin
.pipe(speaker)
// .pipe(process.stdout);

// micInputStream.on('startComplete', () => console.log('\n*** Monitor listening...'));

// micInstance.start();
