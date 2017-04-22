// TODO: Is this production ready?
require('babel-core/register');
require('babel-polyfill');

if (process.argv.includes('--build')) {
	require('./lib/preprocess-images').init();
} else {
	require('./app');
}
