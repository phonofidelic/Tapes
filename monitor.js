const { spawn } = require('child_process');
const mic = require('mic');
const Speaker = require('speaker');

const micInstance = mic({
    rate: '44100',
    channels: '1',
    debug: true
    // exitOnSilence: 6
});
const micInputStream = micInstance.getAudioStream();


// Create the Speaker instance
const speaker = new Speaker({
  channels: 1,          // 1 channels
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100     // 44,100 Hz sample rate
});

// PCM data from stdin gets piped into the speaker
micInputStream.pipe(speaker);
// micInputStream.pipe(process.stdout);

// micInputStream.on('ready', () => console.log('\n*** Listening...'))

micInstance.start()