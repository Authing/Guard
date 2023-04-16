const fs = require('fs')

const path = require('path')

// 加载根目录的config.yaml
const { cosmiconfigSync } = require('cosmiconfig');

// 确保config.yaml存在
fs.appendFileSync(path.resolve(__dirname, '../../config.yaml'), '')

const config = cosmiconfigSync('config', {
	searchPlaces: [
		'config.yaml',
	]
}).search()

module.exports = {
	basePath:  process.env.NODE_ENV === 'production' ? '/packages/guard/doc/' : '/',
	config: config && config.config
};
