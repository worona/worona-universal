# Worona Universal

## Development

Run `npm start` to start the project in development mode.

Run `npm run build -- --prod` and `npm start -- --prod` to start the project in production mode.

Server starts in `http://localhost:3000` by default.

## Npm Scripts

### Production
It sets `NODE_ENV` to `production`.

`npm start -- --prod` or `npm start -- -p`

### Https
It starts Express server on `https://localhost:3000`

`npm start -- --https` or `npm start -- -s`

### Wordpress
It sets Webpack's `publicPath` to `http://localhost:3000` (or `https://localhost:3000` when combined with `--https`).

`npm start -- --wp` or `npm start -- -w`

### Node Debug

It starts node in debug mode.

`npm start -- --debug` or `npm start -- -d`

### Custom publicPath

It sets Webpack's `publicPath` to a custom url.

`npm start -- --publicPath https://ngrok.io/xxx`
