const path = require('path');
const sharp = require('sharp');
const fs = require('graceful-fs');

const groupBy = require('lodash/fp/groupBy');
const memoize = require('lodash/memoize');
const sortBy = require('lodash/fp/sortBy');
const round = require('lodash/round');
const mapValues = require('lodash/fp/mapValues');
const map = require('lodash/fp/map').convert({cap: false});
const pipe = require('lodash/fp/pipe');

const rawRecords = require('../images/dest/records.json');
const {MAX_IMAGE_DIMENSIONS} = require('../config/environment');


exports.images = new ImageManager(rawRecords, {
	maxDimensions: MAX_IMAGE_DIMENSIONS
});


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
