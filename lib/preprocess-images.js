// Dependencies
//------------------------------------------------
const {promisify, promisifyAll} = require('bluebird');
const fs = promisifyAll(require('graceful-fs'));
const glob = promisify(require('glob'));
const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));
const sharp = require('sharp');
const path = require('path');

// Project
const {getImageMetaData} = require('./libImage');
const {getMetaFromFilepath, processRecordsForSaving} = require('./libImageRecords');
const {
	MAX_IMAGE_DIMENSIONS,
	IMAGE_SOURCE_PATH,
	IMAGE_DEST_PATH
} = require('../config');


const processFiles = async (filepaths) => {
	const fileData = await Promise.all(filepaths.map(async (filepath) => {
		// get file
		const file = await fs.readFileAsync(filepath);
		const image = sharp(file);

		// get meta
		const {ratio, largestDimension} = await getImageMetaData(image);
		const {category, subCategory, name} = getMetaFromFilepath(filepath);

		// prep output
		const outputDir = IMAGE_DEST_PATH.join(category, subCategory).value;
		const outputFilepath = path.format({dir: outputDir, name, ext: '.jpg'});
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
			subCategory,
			category,
			ratio,
			largestDimension
		};
	}));

	return processRecordsForSaving(fileData);
};

const run = async () => {
	const [files] = await Promise.all([
		// Get files to process
		glob(IMAGE_SOURCE_PATH.join('*/*/*.jp*g').value, {nocase: true}),

		// Delete existing output files
		rimraf(IMAGE_DEST_PATH.value)
	]);

	// Resize images
	const fileData = await processFiles(files);
	return await fs.writeFileAsync(
		IMAGE_DEST_PATH.join('records.json').value,
		JSON.stringify(fileData, null, '\t')
	);
};

run();
