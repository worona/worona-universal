import React from 'react';
import PropTypes from 'prop-types';
import { Provider, inject } from 'mobx-react';
import { Helmet } from 'react-helmet';

let Color = ({ history, color, colorAndNumber, toggleColor }) => [
  <div key={1}>{color}</div>,
  <div key={2}>{colorAndNumber}</div>,
  <button key={3} onClick={toggleColor}>
    Toggle
  </button>,
  <Helmet key={4}>
    <title>Worona</title>
  </Helmet>,
  <Link key={5} history={history} url={'test'} id={0} type={'post'} siteId={0}>
    {'test link'}
  </Link>,
];

Color = inject(({ stores }) => ({
  color: stores.color,
  colorAndNumber: stores.colorAndNumber,
  toggleColor: stores.toggleColor,
}))(Color);

let Link = ({ history, url, id, type, children }) => (
  <a href={url} onClick={e => {
    e.preventDefault();
    history.push(url, { id, type });
  }}>
    {children}
  </a>
);

Link = inject(({ stores }) => ({
  color: stores.color,
  colorAndNumber: stores.colorAndNumber,
  toggleColor: stores.toggleColor,
}))(Link);

const App = ({ history, stores }) => (
  <Provider stores={stores}>
    <Color history={history} />
  </Provider>
);
App.propTypes = {
  history: PropTypes.shape({}).isRequired,
  stores: PropTypes.shape({}).isRequired,
};

export default App;
