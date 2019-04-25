if (process.env.NODE_ENV === 'production') {
	module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'testing') {
	module.exports = require('./test');
} else {
	module.exports = require('./dev');
}
