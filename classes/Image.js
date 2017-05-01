'use strict';

const path = require('path');
const sharp = require('sharp');
const fs = require('graceful-fs');

const round = require('lodash/round');


module.exports = class Image {
	constructor(imageData, options) {
		this.filepath = imageData.filepath;
		this.width = imageData.width;
		this.height = imageData.height;
		this.imageRootPath = options.imageRootPath;
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

	get relativeFilePath() {
		return path.relative(this.imageRootPath, this.filepath);
	}

	get categoryIds() {
		return path.dirname(this.relativeFilePath).split(path.sep).concat('all');
	}

	createReadStream(width, height) {
		const stream = fs.createReadStream(this.filepath);

		if (!width || !height) return stream;

		const transformer = sharp()
			.resize(width, height)
			.crop(sharp.strategy.entropy);

		return stream.pipe(transformer);
	}
};
