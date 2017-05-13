const path = require('path');
const root = filepath => path.resolve(__dirname, filepath);
// TODO: change this:
const isDebug = true;


module.exports = {
	entry: root('./main.js'),
	output: {
		path: root('../public'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					{loader: 'style-loader'},
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDebug,
							// CSS Modules https://github.com/css-modules/css-modules
							modules: true,
							localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
							// CSS Nano http://cssnano.co/options/
							minimize: !isDebug
						}
					}
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				loader: 'url-loader',
				options: {limit: 10000}
			}
		]
	}
};
