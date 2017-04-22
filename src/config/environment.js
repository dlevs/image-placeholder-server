// const nconf = require('nconf');
//
// // Setup nconf to use (in-order):
// //   1. Command-line arguments
// //   2. Environment variables
// //   3. A file located at 'path/to/config.json'
// nconf
// 	.argv()
// 	.env()
// 	.file({file: 'path/to/config.json'});
//
// const initEnvironment = () => {
// 	// Load variables from .env file to `process.env`.
// 	require('dotenv').config();
//
// 	// Validate environment variables.
// 	const validateObjectProperties = require('./validateObjectProperties');
// 	const {expectedEnvironmentVariables} = require('./config');
// 	validateObjectProperties('process.env', process.env, expectedEnvironmentVariables);
// };
//
// module.exports = {init: initEnvironment};

// If adding to this file, consider if the varibale would be better suited
// to the .env file.
module.exports = {
	MAX_IMAGE_DIMENSIONS: 2000,
	URL_DIMENSION_DELIMITER: 'x',
	PORT: 2609
	// // Assert that these values exist on `process.env`
	// expectedEnvironmentVariables: [
	// 	{id: 'NODE_ENV', oneOf: ['development', 'production']},
	// 	'IMAGE_CACHE_MAX_AGE_SECONDS',
	// 	'HTML_CACHE_MAX_AGE_SECONDS',
	// 	'PORT'
	// ]
};

