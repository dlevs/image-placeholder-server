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
	image.categoryIds.forEach((category) => {
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
	constructor(imageRecords, options) {
		this.images = imageRecords.map((imageData) => new Image(imageData, options));
		this.organizedImages = organizeImages(this.images);
	}

	get length() {
		return this.images.length;
	}

	get categoryIds() {
		return Object.keys(this.organizedImages).sort();
	}

	getCategory(category) {
		return this.organizedImages[category];
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
	 * @param {String} categoryId
	 * @param {Number} ratio
	 */
	getImageGroup(ratio = 1, categoryId = 'all') {
		const imageGroup = (() => {
			const category = this.getCategory(categoryId);
			if (!category) return;

			const imageGroup = category.find((image) => image.ratio >= ratio);

			if (imageGroup) return imageGroup;

			// No record found. Value is either less than the smallest ratio...
			if (ratio < category[0].ratio) return category[0].images;

			// ...or it's bigger than the last.
			return category[category.length - 1];
		})();

		if (!imageGroup) return [];

		return imageGroup.images;
	}

	getImage({category, ratio, largestDimension}) {
		const imageGroup = this.getImageGroup(ratio, category);
		// Choose an image from the group based on image size
		const index = Math.round((largestDimension / Math.max(imageGroup)) * (imageGroup.length - 1));
		return imageGroup[index];
	}
};
