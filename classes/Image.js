'use strict';

const path = require('path');
const sharp = require('sharp');
const fs = require('graceful-fs');

const round = require('lodash/round');

const {MAX_IMAGE_DIMENSIONS} = require('../config/environment');
const {IMAGE_DEST_PATH} = require('../config/paths');

module.exports = class Image {
	constructor({filepath, width, height}) {
		this.filepath = filepath;
		this.width = width;
		this.height = height;
		// this.maxDimensions = MAX_IMAGE_DIMENSIONS;
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
		return path.relative(IMAGE_DEST_PATH.value, this.filepath);
	}

	get categories() {
		return path.dirname(this.relativeFilePath).split(path.sep).concat('all');
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
};
