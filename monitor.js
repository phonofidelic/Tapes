const { spawn } = require('child_process');
const mic = require('mic');
const Speaker = require('speaker');

const micInstance = mic({
    rate: '44100',
    channels: '1',
    // debug: true
    // exitOnSilence: 6
});

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
const micInputStream = micInstance.getAudioStream();

/*** speaker: https://www.npmjs.com/package/speaker ***
 *
 ***/
// Create the Speaker instance
const speaker = new Speaker({
  channels: 1,          // 1 channels
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100     // 44,100 Hz sample rate
});

// PCM data from stdin gets piped into the speaker
micInputStream.pipe(speaker);

micInputStream.on('startComplete', () => console.log('\n*** Monitor listening...'));

micInstance.start();