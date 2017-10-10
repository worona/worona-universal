# Worona Universal

## Development

Run `npm start:pwa` to start the project in development mode.

Run `npm run build:pwa -- --prod` and `npm start:pwa -- --prod` to start the project in production mode.

Server starts in `http://localhost:3000` by default.

## Npm Scripts

### Production
It sets `NODE_ENV` to `production`.

`npm start:pwa -- --prod` or `npm start:pwa -- -p`

### Https
It starts Express server on `https://localhost:3000`

`npm start:pwa -- --https` or `npm start:pwa -- -s`

### Wordpress
It sets Webpack's `publicPath` to `http://localhost:3000` (or `https://localhost:3000` when combined with `--https`).

`npm start:pwa -- --wp` or `npm start:pwa -- -w`

### Node Debug

It starts node in debug mode.

`npm start:pwa -- --debug` or `npm start:pwa -- -d`

### Custom publicPath

It sets Webpack's `publicPath` to a custom url.

`npm start:pwa -- --publicPath https://ngrok.io/xxx`
