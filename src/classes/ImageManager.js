class ImageManager {
	constructor(imageRecords,  options={}) {
		const images = imageRecords.map((record) => new Image(record, options));
		this.imagesByCategory = this.constructor.organizeRecords(images);
		this.maxDimensions = options.maxDimensions;
	}

	static organizeRecords(images) {
		const organize = pipe(
			// Organize images in array
			sortBy(['largestDimension', 'filepath']),

			// Partition the array values to group same ratios together
			groupBy('coarseRatio'),
			map((value, key) => ({
				ratio: Number(key),
				images: value
			})),
			sortBy(['ratio'])
		);

		return mapValues(organize)({
			...groupBy('category')(images),
			...groupBy('subCategory')(images),
			all: images
		});
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

	getImage(category, ratio, largestDimension) {
		const images = this.getImagesOfClosestRatio(category, ratio);
		const index = Math.round((largestDimension / this.maxDimensions) * (images.length - 1));
		return images[index];
	}
}
