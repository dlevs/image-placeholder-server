'use strict';

const path = require('path');

const ImageManager = require('../classes/ImageManager');
const rawRecords = require('../images/dest/records.json');
const {MAX_IMAGE_DIMENSIONS} = require('../config/environment');


exports.images = new ImageManager(rawRecords, {
	maxDimensions: MAX_IMAGE_DIMENSIONS
});

console.log(exports.images.length)
console.log(exports.images.categoryIds)


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
