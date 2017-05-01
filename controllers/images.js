'use strict';

const {
	CACHE_MAX_AGE_SECONDS,
	MAX_IMAGE_DIMENSIONS
} = require('../config/environment');
const {images} = require('../lib/libImageRecords');
const {constrainDimensions} = require('../lib/libImageMeta');

const getImageDataFromCaptures = ([category = 'all', widthStr, heightStr]) => {
	const {width, height} = constrainDimensions(
		Number(widthStr),
		Number(heightStr !== undefined ? heightStr : widthStr),
		MAX_IMAGE_DIMENSIONS
	);

	return {
		category,
		width,
		height,
		ratio: width / height,
		largestDimension: Math.max(width, height)
	}
};

/* Example URLS:
 *
 * /600
 * /600.jpg
 * /600x400
 * /600x400.jpg
 * /ducks/600
 * /ducks/600x400
 * /ducks/600x400.jpg
 */
exports.IMAGE_ROUTE_REGEX = new RegExp(
	// Leading URL slash
	'^\\/' +

	// Optional category, for example "animals" in "/animals/600x400"
	'(?:([^\/]+)\/)?' +

	// Width dimension
	'(\\d+)' +

	// Optional height dimension
	'(?:x(\\d+))?' +

	// Optional file extension
	'(?:\\.jpg)?' +

	'$'
);


/**
 * GET /600
 * GET /600x400
 * GET /600x400.jpg
 * Render an image with specified dimensions.
 */
exports.getImageOfSize = (ctx) => {
	const {
		category,
		width,
		height,
		ratio,
		largestDimension
	} = getImageDataFromCaptures(ctx.captures);

	const image = images.getImage(category, ratio, largestDimension);
	if (!image) return; //TODO: something better here


	// TODO: Move these to middleware
	ctx.set('Content-Type', 'image/jpeg');
	ctx.set('Cache-Control', `max-age=${CACHE_MAX_AGE_SECONDS}`);
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.body = image.getResizedImage(width, height);
};
