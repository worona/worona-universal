import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
// import { Helmet } from 'react-helmet';
import { clientReactRendered } from '../extensions/build/actions';
import Slider from './Slider';

// const Color = ({ color = 'red', colorAndNumber = 'red and 7', toggleColor = () => {} }) => [
//   <div key={2}>{colorAndNumber}</div>,
//   <button key={3} onClick={toggleColor}>
//     Togglee
//   </button>,
//   <Helmet key={4}>
//     <title>Worona</title>
//   </Helmet>,
// ];

class App extends React.Component {
  componentDidMount() {
    this.props.store.dispatch(clientReactRendered());
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Slider slides={15} store={this.props.store} handleChangeIndex={this.handleChangeIndex} />
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
