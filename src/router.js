const router = require('koa-router')();

const homeController = require('./controllers/home');
const imageController = require('./controllers/images');

router
	.get('/', homeController.index)
	.get(imageController.IMAGE_ROUTE_REGEX, imageController.getImageOfSize);

module.exports = router;
