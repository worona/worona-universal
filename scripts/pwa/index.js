/* eslint-disable */
const argv = require('minimist')(process.argv.slice(2));
const { spawn } = require('child_process');

if (argv.server && !argv.p && !argv.prod)
  throw new Error(
    "'Server only' mode can't be started in development mode. Please use 'npm start' or 'npm run server -- -p'."
  );

process.env.NODE_ENV = argv.p || argv.prod ? 'production' : 'development';
console.log('> Using NODE_ENV=' + process.env.NODE_ENV);

if (!argv.build && !!(argv.s || argv.https)) {
  process.env.HTTPS_SERVER = true;
  console.log('> Using HTTPS_SERVER=' + process.env.HTTPS_SERVER);
}

const protocol = argv.s || argv.https ? 'https://' : 'http://';
if (!argv.server) {
  if (argv.publicPath) process.env.PUBLIC_PATH = `${argv.publicPath.replace(/\/$/g, '')}/`;
  else if (argv.w || argv.wp) {
    process.env.PUBLIC_PATH = `${protocol}localhost:3000/`;
  }
  if (process.env.PUBLIC_PATH)
    console.log('> Using hardcoded PUBLIC_PATH=' + process.env.PUBLIC_PATH);
  else console.log('> Using dynamic PUBLIC_PATH');
}

console.log();

const args = ['scripts/pwa/start.js'];

if (argv.build) args.push('--build');
else if (argv.server) args.push('--server');

if (argv.d || argv.debug) args.unshift('--inspect');

spawn('node', args, { stdio: 'inherit', env: process.env });
