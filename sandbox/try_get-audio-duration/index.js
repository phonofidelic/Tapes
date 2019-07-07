const { getAudioDurationInSeconds } = require('get-audio-duration')
const fs = require('fs')

const readFile = fs.createReadStream('/Users/chris/Desktop/tapes_test_saves/68131686-413c-4346-bb1d-ebb6ec85bf32.flac')
getAudioDurationInSeconds(readFile)
	.then(duration => {
		recorderWindow.webContents.send('rec:set_rec_duration', duration)
	})
	.catch(err => console.error('Error: getAudioDurationInSeconds:', err))