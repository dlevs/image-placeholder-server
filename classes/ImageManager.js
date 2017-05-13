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
const findClosest = require('find-closest');

const Image = require('./Image');

const sortImages = sortBy(['largestDimension', 'filepath']);
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
	 *         images: []
	 *     },
	 *     {
	 *         ratio: 0.8,
	 *         images: []
	 *     },
	 *     {
	 *         ratio: 1.2,
	 *         images: []
	 *     },
	 * ]
	 * getImageGroup(0.9);
	 * // returns the records array from the object with ratio 0.8.
	 *
	 * @param {String} categoryId
	 * @param {Number} ratio
	 */
	getImageGroup(ratio = 1, categoryId = 'all') {
		const category = this.getCategory(categoryId);
		if (!category) return;

		const closest = findClosest(category, ratio, 'ratio');
		if (!closest) return;

		return closest.images;
	}

	getImage({category, ratio, largestDimension}) {
		// Choose an image from the group based on image size
		const imageGroup = this.getImageGroup(ratio, category);
		const largestImage = imageGroup[imageGroup.length - 1];
		const index = Math.round((largestDimension / largestImage.largestDimension) * (imageGroup.length - 1));
		return imageGroup[index];
	}
};
