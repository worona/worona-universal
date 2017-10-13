const { readdirSync } = require('fs');
const path = require('path');

const getNodeModules = () =>
  readdirSync(path.resolve(__dirname, `../../../packages/`))
    .filter(name => name !== '.gitignore')
    .map(name => path.resolve(__dirname, `../../../packages/${name}/node_modules`));

module.exports = {
  getNodeModules,
};
