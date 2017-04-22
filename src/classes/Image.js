module.exports = class Image {
	constructor({filepath, subCategory, category, width, height}, options={}) {
		this.filepath = filepath;
		this.subCategory = subCategory;
		this.category = category;
		this.width = width;
		this.height = height;
		this.maxDimensions = options.maxDimensions;
	}

	get largestDimension() {
		return Math.max(this.width, this.height);
	}

	get fineRatio() {
		return this.width / this.height;
	}

	get coarseRatio() {
		return round(this.fineRatio, 1);
	}

	getFileStream() {
		return fs.createReadStream(this.filepath);
	}

	getResizedImage(width, height) {
		const transformer = sharp()
			.resize(width, height)
			.crop(sharp.strategy.entropy);

		return this.getFileStream().pipe(transformer);
	}
}
