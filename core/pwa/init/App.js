import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import universal from 'react-universal-component';
import { clientReactRendered } from '../packages/build/actions';

const PackageComponent = universal(props => import(`../../../packages/${props.name}/src/pwa`), {
  onLoad: (module, { isSync, isServer }, props, context) => {
    console.log(`Loaded: ${props.name}`);
  },
});

class App extends React.Component {
  componentWillMount() {
    this.props.store.dispatch(clientReactRendered());
    console.log('App loaded.');
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          {this.props.packages.map(pkg => <PackageComponent key={pkg} name={pkg} />)}
        </div>
      </Provider>
    );
  }
}
App.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
  packages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default App;
