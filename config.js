const chainMethods = require('chain-methods');
const Path = chainMethods(require('path'));

const ROOT_PATH = new Path(__dirname);

// If adding to this file, consider if the varibale would be better suited
// to the .env file.
module.exports = {
	MAX_IMAGE_DIMENSIONS: 2000,
	URL_DIMENSION_DELIMITER: 'x',
	ROOT_PATH,
	IMAGE_SOURCE_PATH: ROOT_PATH.join('images/src'),
	IMAGE_DEST_PATH: ROOT_PATH.join('images/dest'),
	PORT: 2609
	// // Assert that these values exist on `process.env`
	// expectedEnvironmentVariables: [
	// 	{id: 'NODE_ENV', oneOf: ['development', 'production']},
	// 	'IMAGE_CACHE_MAX_AGE_SECONDS',
	// 	'HTML_CACHE_MAX_AGE_SECONDS',
	// 	'PORT'
	// ]
};
