const fs = require('fs');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

const filePath = '/Users/chris/Desktop/tapes_test_saves/df0547df-14d4-4d36-a36e-0168c7a30231.flac';
fs.readFile(filePath, (err, fileData) => {
	if (err) console.error(err)
		console.log('fileData:', fileData)
	console.log('fileData.length:', fileData.length)

	ffprobe(filePath, { path: ffprobeStatic.path })
	.then(info => {
		// console.log(info)
		const data = info.streams[0]
		console.log('data:', data)
		console.log('(data.sample_rate * data.channels * data.bits_per_sample / 8)', (data.sample_rate * data.channels * data.bits_per_sample / 8))

		const fileLength = fileData.length,
					sampleRate = data.sample_rate,
					channels = data.channels,
					bitsPerSample = 4;

		const duration = (fileLength - 102) / (sampleRate * channels * bitsPerSample / 16);
		console.log('duration:', duration)
	})
	.catch(err => console.error(err))
})

