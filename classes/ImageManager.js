'use strict';

const groupBy = require('lodash/fp/groupBy');
const sortBy = require('lodash/fp/sortBy');
const flatMap = require('lodash/fp/flatMap');
const reduce = require('lodash/fp/reduce');
const round = require('lodash/round');
const uniq = require('lodash/uniq');
const mapValues = require('lodash/fp/mapValues');
const map = require('lodash/fp/map').convert({cap: false});
const pipe = require('lodash/fp/pipe');

const Image = require('./Image');

const sortImages = sortBy(['ratio', 'largestDimension', 'filepath']);
const groupImagesByRatio = pipe(
	groupBy('coarseRatio'),
	map((images, ratio) => ({
		ratio: Number(ratio),
		images: sortImages(images)
	})),
	sortBy(['ratio'])
);
const groupImagesByCategory = reduce((prev, image) => {
	image.categories.forEach((category) => {
		prev[category] = prev[category] || [];
		prev[category].push(image);
	});
	return prev;
}, {});
const organizeImages = pipe(
	groupImagesByCategory,
	mapValues(groupImagesByRatio)
);


module.exports = class ImageManager {
	constructor(imageRecords, options = {}) {
		this.images = imageRecords.map((record) => new Image(record, options));
		this.imagesByCategory = organizeImages(this.images);
		// this.maxDimensions = options.maxDimensions;
		console.log(JSON.stringify(this.imagesByCategory, null, 4))
	}

	get length() {
		return this.images.length;
	}

	get categories() {
		return Object.keys(this.imagesByCategory).sort();
	}

	/**
	 * Get the record group with the closest ratio to that provided.
	 * This assumes that the records are already sorted by ratio.
	 *
	 * @example
	 * const records = [
	 *     {
	 *         ratio: 0.8,
	 *         records: []
	 *     },
	 *     {
	 *         ratio: 0.8,
	 *         records: []
	 *     },
	 *     {
	 *         ratio: 1.2,
	 *         records: []
	 *     },
	 * ]
	 * getRecordsWithClosestRatio(records, 0.9);
	 * // returns the records array from the object with ratio 0.8.
	 *
	 * @param {Object[]} records
	 * @param {Object} value
	 */
	_getImagesGroupOfClosestRatio(category, ratio) {
		if (!this.imagesByCategory[category]) return;

		const ratioGroups = this.imagesByCategory[category];
		const imageGroup = ratioGroups.find((image) => image.ratio >= ratio);

		if (imageGroup) return imageGroup;

		// No record found. Value is either less than the smallest ratio...
		if (ratio < ratioGroups[0].ratio) return ratioGroups[0].images;

		// ...or it's bigger than the last.
		return ratioGroups[ratioGroups.length - 1];
	};

	getImagesOfClosestRatio(category, ratio) {
		const imageGroup = this._getImagesGroupOfClosestRatio(category, ratio);

		if (!imageGroup) return [];

		return imageGroup.images;
	}

	getImage({category = null, ratio = 1, largestDimension} = {}) {
		const images = this.getImagesOfClosestRatio(category, ratio);
		const index = Math.round((largestDimension / this.maxDimensions) * (images.length - 1));
		return images[index];
	}
};
