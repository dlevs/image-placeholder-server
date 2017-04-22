const chainMethods = require('chain-methods');
const Path = chainMethods(require('path'));

const ROOT_PATH = new Path(__dirname).join('../');

module.exports = {
	ROOT_PATH,
	IMAGE_SOURCE_PATH: ROOT_PATH.join('images/src'),
	IMAGE_DEST_PATH: ROOT_PATH.join('images/dest')
};
