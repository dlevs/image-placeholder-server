'use strict';

const Router = require('koa-router');

const homeController = require('./controllers/home');
const imageController = require('./controllers/images');

module.exports = Router()
	.get('/', homeController.index)
	.get(imageController.IMAGE_ROUTE_REGEX, imageController.getImageOfSize);
