'use strict';

const path = require('path');

const ImageManager = require('../classes/ImageManager');
const {MAX_IMAGE_DIMENSIONS} = require('../config/environment');
const {IMAGE_DEST_PATH} = require('../config/paths');

exports.images = new ImageManager(
	require('../images/dest/records.json'),
	{
		maxDimension: MAX_IMAGE_DIMENSIONS,
		imageRootPath: IMAGE_DEST_PATH.value
	}
);

console.log(exports.images.length);
console.log(exports.images.categoryIds);
console.log(exports.images.getImage({
	category: 'ducks',
	ratio: 1.7,
	largestDimension: 1900
}));


/**
 * Parse filepath to determine metadata about the file.
 *
 * @example
 * getMetaFromFilepath('/animals/ducks/duck.jpg');
 * // {name: 'duck', category: 'animals', subCategory: 'ducks'}
 *
 * @param {String} filepath
 * @return {{name: String, subCategory: String, category: String}}
 */
exports.getMetaFromFilepath = (filepath) => {
	const parsedFilespath = path.parse(filepath);
	const directories = parsedFilespath.dir.split(path.sep);

	return {
		name: parsedFilespath.name,
		subCategory: directories.pop(),
		category: directories.pop()
	};
};
