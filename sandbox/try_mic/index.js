const mic = require('mic');
const Speaker = require('speaker');
const fs = require('fs');
const { Duplex } = require('stream');


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
const micInstance = mic({
    rate: '44100',
    channels: '2',
    // debug: true,
    fileType: 'mp3'
    // exitOnSilence: 6
});
const micInputStream = micInstance.getAudioStream();
 
const outputFileStream = fs.WriteStream('./tmp/output.mp3');


/*** speaker: https://www.npmjs.com/package/speaker ***
 *
 */
const speaker = new Speaker({
  channels: 2,          // 2 channels
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100     // 44,100 Hz sample rate
});


/*** audio-speaker: https://www.npmjs.com/package/audio-speaker
 *
 */
// const speaker = new Speaker({})



// micInputStream.pipe(speaker);

// micInputStream.on('error', function(err) {
//     console.log("Error in Input Stream: " + err);
// });
 
// micInstance.start();



class DuplexTest extends Duplex {
	constructor(options){
		super(options)
	}

	_write(chunk, callback) {
		console.log('write chunk', chunk)
		return callback(chunk)
	}
	
	_read(src) {
		return console.log('read src', src)
	}

	start(inStream, outStream) {
		// console.log('*************************** inStream:', inStream)
		// console.log('*************************** outStream:', outStream)
		this._read(micInputStream.start())
	}
}

const duplex = new DuplexTest()
// duplex._read('hello', () => console.log('done'))
// duplex._write('test', (chunk) => console.log('done, chunk:', chunk))
duplex.start(micInstance, speaker)


