/* eslint-disable camelcase, no-undef, no-underscore-dangle */
if (process.env.PUBLIC_PATH === '/static/') {
  __webpack_public_path__ = window.__worona_public_path__
    ? `${window.__worona_public_path__}static/`
    : '/static/';
} else {
  __webpack_public_path__ = process.env.PUBLIC_PATH;
}
