// require('./environment').init();
const config = require('./config/environment');
require('./server').init({port: config.PORT});
