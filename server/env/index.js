const path = require('path');
const devConfigPath = path.join(__dirname, './dev.js');
const productionConfigPath = path.join(__dirname, './prod.js');

if (process.env.NODE_ENV === 'production') {
    module.exports = require(productionConfigPath);
} else {
    module.exports = require(devConfigPath);
}