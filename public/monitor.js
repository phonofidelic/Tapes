const { spawn } = require('child_process');
const Speaker = require('speaker');

const CHANNEL_COUNT = 1;
const SAMPLE_RATE = 44100;
const BIT_DEPTH = 16;

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

// speaker.on('error', err => console.log(err))