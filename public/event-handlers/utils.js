function startServer(savDir) {
	const express = require('express');
	const app = express();
	const port = 5000;

	app.get('/', (req, res) => res.send('Hello World!'))

	// Configure access-control headers
	app.use((req, res, next) => {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	console.log('\n*** server, savDir:', savDir)
	app.use('/tmp', express.static(savDir));

	return app.listen(port, () => console.log(`Express server listening on port ${port}`))
}

module.exports = {
	startServer
}