// require('./environment').init();
const config = require('./config');
require('./server').init({port: config.PORT});
