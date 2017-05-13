'use strict';

// TODO: bad filename
const {images} = require('../lib/libImageRecords');

/**
 * GET /
 * Home page.
 */
exports.index = (ctx) => {
	ctx.render('home', {
		title: 'Home',
		categories: images.categoryIds
	});
};
