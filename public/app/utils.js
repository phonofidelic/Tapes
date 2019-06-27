function serveStatic(endPoint, dir, port) {
	const express = require('express');
	const app = express();
	const PORT = port | 5000;

	// app.get('/', (req, res) => res.send('Hello World!'))

	// Configure access-control headers
	app.use((req, res, next) => {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	console.log('\n*** server, dir:', dir)
	app.use(endPoint, express.static(dir));

	return app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`))
}

module.exports = {
	serveStatic,
}