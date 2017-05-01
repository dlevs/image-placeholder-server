'use strict';

/**
 * GET /
 * Home page.
 */
exports.index = (ctx) => {
	ctx.render('home', {
		title: 'Home'
	});
};
