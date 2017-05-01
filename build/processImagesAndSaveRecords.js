'use strict';

// Dependencies
//------------------------------------------------
const {promisify, promisifyAll} = require('bluebird');
const fs = promisifyAll(require('graceful-fs'));
const glob = promisify(require('glob'));
const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));
const mapLimit = promisify(require('async/mapLimit'));
const sharp = require('sharp');
const path = require('path');

const {MAX_IMAGE_DIMENSIONS, MAX_CONCURRENT_IMAGE_PROCESSES} = require('../config/environment');
const {IMAGE_SOURCE_PATH, IMAGE_DEST_PATH} = require('../config/paths');

const processFile = async (filepath) => {
	// get file
	const file = await fs.readFileAsync(filepath);
	const image = sharp(file);
	const {width, height} = await image.metadata();

	// prep output
	const relativeDir = IMAGE_SOURCE_PATH.relative(filepath).dirname();
	const outputDir = IMAGE_DEST_PATH.join(relativeDir.value).value;
	const outputFilepath = path.format({
		dir: outputDir,
		name: path.parse(filepath).name,
		ext: '.jpg'
	});
	await mkdirp(outputDir);

	// resize and save image
	await image
		.resize(MAX_IMAGE_DIMENSIONS, MAX_IMAGE_DIMENSIONS, {
				kernel: sharp.kernel.lanczos2,
				interpolator: sharp.interpolator.nohalo
			}
		)
		.max()
		.withoutEnlargement()
		.toFile(outputFilepath);

	// return record of file
	return {
		filepath: outputFilepath,
		width,
		height
	};
};

(async () => {
	const [filepaths] = await Promise.all([
		// Get files to process
		glob(IMAGE_SOURCE_PATH.join('**/*.jp*g').value, {nocase: true}),

		// Delete existing output files
		rimraf(IMAGE_DEST_PATH.value)
	]);

	// Resize images
	const fileData = await mapLimit(
		filepaths,
		MAX_CONCURRENT_IMAGE_PROCESSES,
		processFile
	);

	await mkdirp(IMAGE_DEST_PATH.value);
	await fs.writeFileAsync(
		IMAGE_DEST_PATH.join('records.json').value,
		JSON.stringify(fileData, null, '\t')
	);
})();
