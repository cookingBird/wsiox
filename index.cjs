const path = require("path");

if (process.env.NODE_ENV === 'production') {
	module.exports = require('./dist/Wsiox.min.js')
	return;
}

module.exports = require('./dist/Wsiox.js')
