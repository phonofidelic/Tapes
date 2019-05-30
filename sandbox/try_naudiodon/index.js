//https://www.npmjs.com/package/naudiodon
const fs = require('fs');
const portAudio = require('naudiodon');
 
console.log('Hosts:', portAudio.getDevices());
console.log('Devices', portAudio.getHostAPIs());


// Create an instance of AudioIO with inOptions, which will return a ReadableStream
var ai = new portAudio.AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: 48000,
    deviceId: -1 // Use -1 or omit the deviceId to select the default device
  }
});
 
// Create a write stream to write out to a raw audio file
var ws = fs.createWriteStream('test_recs/test.raw');
 
//Start streaming
ai.pipe(ws);
ai.start();

// setTimeout(() => ai.quit(), 10000)




// const ws = fs.createWriteStream('test_recs/test.flac');

// // Create an instance of AudioIO with inOptions and outOptions, which will return a DuplexStream
// const aio = new portAudio.AudioIO({
//   inOptions: {
//     channelCount: 2,
//     sampleFormat: portAudio.SampleFormat16Bit,
//     sampleRate: 44100,
//     deviceId: -1 // Use -1 or omit the deviceId to select the default device
//   },
//   outOptions: {
//     channelCount: 2,
//     sampleFormat: portAudio.SampleFormat16Bit,
//     sampleRate: 44100,
//     deviceId: -1 // Use -1 or omit the deviceId to select the default device
//   }
// });
 
// const ds = aio.start()

// console.log('*** aio:', aio)

// aio.on('data', data => console.log('aio data:', data))

// aio.pipe(ws)

// process.on('SIGINT', () => {
//   console.log('Received SIGINT. Stopping recording.');
//   aio.quit();
//   process.exit(0);
// });