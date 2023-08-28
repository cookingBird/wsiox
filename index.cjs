const path = require("path");

if (process.env.NODE_ENV === 'production') {
	module.exports = require(path.join(__dirname, 'dist/Wsiox.min.js'))
	return;
}

module.exports = require(path.join(__dirname, 'dist/Wsiox.js'))
