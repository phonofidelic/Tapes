const fs = require('fs')

const filePath = '/Users/chris/Desktop/tapes_test_saves/4c5e94c6-a795-4841-bfe2-3570e8b5587f.flac';

fs.readFile(filePath, (err, data) => {
	if (err) console.error(err)
	console.log('data.length:', data.length)
	const duration = data.length / (data.sample_rate * data.channels * data.bits_per_sample / 8);
})