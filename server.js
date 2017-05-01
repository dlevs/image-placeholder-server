'use strict';

const Koa = require('koa');
// TODO: Check this doesn't try to compress images
const compress = require('koa-compress');
const helmet = require('koa-helmet');
const Pug = require('koa-pug');
const router = require('./router');

const initViewEngine = (app) =>
	new Pug({
		// TODO: Use root
		viewPath: './views',
		helperPath: [
			{_: require('lodash')}
		],
		app
	});

const initServer = ({port}) => {
	const app = new Koa();

	app
		.use(compress())
		.use(helmet())
		.use(router.routes())
		.use(router.allowedMethods());

	initViewEngine(app);

	app.listen(port);

	// TODO: use winston
	console.log(`App running on http://127.0.0.1:${port}`);

	return app;
};

exports.init = initServer;
