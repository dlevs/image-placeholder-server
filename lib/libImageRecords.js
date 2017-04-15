const path = require('path');
const groupBy = require('lodash/fp/groupBy');
const sortBy = require('lodash/fp/sortBy');
const round = require('lodash/round');
const mapValues = require('lodash/fp/mapValues');
const map = require('lodash/fp/map').convert({cap: false});
const pipe = require('lodash/fp/pipe');

const {MAX_IMAGE_DIMENSIONS} = require('../config');


// TODO: Messy
const groupRecords = (records) => {
	const categories = groupBy('category')(records);
	const subCategories = groupBy('subCategory')(records);
	const all = Object.assign({}, categories, subCategories, {all: records});
	const allByRatio = mapValues(pipe(
		groupBy('ratio'),
		map((value, key) => ({
			ratio: Number(key),
			records: value
		})))
	)(all);

	return allByRatio;
};

const imageRecords = groupRecords(require('../images/dest/records.json'));

exports.getMetaFromFilepath = (filepath) => {
	const parsedFilespath = path.parse(filepath);
	const directories = parsedFilespath.dir.split(path.sep);

	return {
		name: parsedFilespath.name,
		subCategory: directories.pop(),
		category: directories.pop()
	};
};

/**
 * Retrun a processed collection of image file data.
 *
 * @param {Object[]}
 * @return {Object[]}
 */
exports.processRecordsForSaving = pipe(
	// Round the ratio up to allow images of similar aspect-ratio to be
	// grouped later on.
	map((record) => Object.assign(
		{},
		record,
		{ratio: round(record.ratio, 1)}
	)),
	// Sort for easy, predictable traversal.
	sortBy(['ratio', 'largestDimension', 'filepath'])
);


/**
 * This assumes that the records are already sorted by ratio.
 * //TODO: docs
 *
 * @param records
 * @param value
 */
const getRecordGroupWithClosestRatio = (records, value) => {
	const record = records.find(({ratio}) => ratio >= value);

	if (record) return record;

	// No record found. Value is either less than the smallest ratio...
	if (value < records[0].ratio) return records[0];

	// ...or it's bigger than the last.
	return records[records.length - 1];
};

exports.getImageRecord = (category, ratio, largestDimension) => {
	const categoryGroup = imageRecords[category];
	if (!category) return;
	const retioGroup = getRecordGroupWithClosestRatio(categoryGroup, ratio).records;
	const index = Math.round((largestDimension / MAX_IMAGE_DIMENSIONS) * (retioGroup.length - 1));
	return retioGroup[index];
};
