const nconf = require('nconf');

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
nconf
	.argv()
	.env()
	.file({file: 'path/to/config.json'});

const initEnvironment = () => {
	// Load variables from .env file to `process.env`.
	require('dotenv').config();

	// Validate environment variables.
	const validateObjectProperties = require('./validateObjectProperties');
	const {expectedEnvironmentVariables} = require('./config');
	validateObjectProperties('process.env', process.env, expectedEnvironmentVariables);
};

module.exports = {init: initEnvironment};
