const { readdirSync } = require('fs');
const path = require('path');

const getNodeModules = type =>
  readdirSync(path.resolve(__dirname, `../../../packages/${type}`))
    .filter(name => name !== '.gitignore')
    .map(name => path.resolve(__dirname, `../../../packages/${type}/${name}/node_modules`));

module.exports = {
  getNodeModules,
};
