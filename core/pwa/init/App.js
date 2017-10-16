import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { clientReactRendered } from '../packages/build/actions';
// import UniversalComponent from './universal';
import universal from 'react-universal-component';

const Color = ({ color = 'red', colorAndNumber = 'red and 7', toggleColor = () => {} }) => [
  <div key={1}>{color}</div>,
  <div key={2}>{colorAndNumber}</div>,
  <button key={3} onClick={toggleColor}>
    Toggle
  </button>,
  <Helmet key={4}>
    <title>Worona</title>
  </Helmet>,
  <UniversalComponent key={5} name="saturn-app-theme-worona" />,
  <UniversalComponent key={6} name="wp-org-connection-app-extension-worona" />
];

const UniversalComponent = universal(props => import(`../../../packages/${props.name}/src/pwa`), {
  onLoad: (module, { isSync, isServer }, props, context) => {
    console.log('loaded!!!');
  }
});

class App extends React.Component {
  componentDidMount() {
    this.props.store.dispatch(clientReactRendered());
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <UniversalComponent name="saturn-app-theme-worona" />
      </Provider>
    )
  }
}
App.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
