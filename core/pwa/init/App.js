import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { clientReactRendered } from '../extensions/build/actions';
import Swipe from '../extensions/Swipe';

const Slide = ({ key, length }) => (
  <div key={key}>
    {Array(length)
      .fill(0)
      .map((e, num) => <p>{num}</p>)}
  </div>
);

const Slider = ({ slides }) => (
  <Swipe index={0}>
    {Array(slides)
      .fill(0)
      .map((e, num) => <Slide key={num} length={num}/>)}
  </Swipe>
)

const Color = ({ color = 'red', colorAndNumber = 'red and 7', toggleColor = () => {} }) => [
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
        <Slider slides={5} />
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
