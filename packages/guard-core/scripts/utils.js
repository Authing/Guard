const path = require('path')

module.exports.resolve = function resolve(dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}