import React from 'react';
import PropTypes from 'prop-types';
import { Provider, inject } from 'mobx-react';

let Color = ({ color, colorAndNumber, toggleColor }) => [
  <div key={1}>{color}</div>,
  <div key={2}>{colorAndNumber}</div>,
  <button key={3} onClick={toggleColor}>
    Toggle
  </button>,
];

Color = inject(({ stores }) => ({
  color: stores.color,
  colorAndNumber: stores.colorAndNumber,
  toggleColor: stores.toggleColor,
}))(Color);

const App = ({ stores }) => (
  <Provider stores={stores}>
    <Color />
  </Provider>
);
App.propTypes = {
  stores: PropTypes.shape({}).isRequired,
};

export default App;
