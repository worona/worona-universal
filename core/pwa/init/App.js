import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { clientReactRendered } from '../extensions/build/actions';

const Color = ({ color = 'red', colorAndNumber = 'red and 7', toggleColor = () => {} }) => [
  <div key={1}>
    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26].map(num => (
      <p>{num}</p>
    ))}
  </div>,
  <div key={2}>{colorAndNumber}</div>,
  <button key={3} onClick={toggleColor}>
    Togglee
  </button>,
  <Helmet key={4}>
    <title>Worona</title>
  </Helmet>,
];

class App extends React.Component {
  componentDidMount() {
    this.props.store.dispatch(clientReactRendered());
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <Color />
      </Provider>
    );
  }
}
App.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
