import React from 'react';
import universal from 'react-universal-component';
import styled from 'react-emotion';
import Loading from './Loading';
import NotFound from './NotFound';
import { pages, nextIndex, indexFromPath } from '../utils';

const UniversalComponent = universal(props => import(`./${props.page}`), {
  minDelay: 1200,
  loading: Loading,
  error: NotFound,
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const index = indexFromPath(history.location.pathname);

    this.state = {
      index,
      loading: false,
      done: false,
      error: false,
    };

    history.listen(({ pathname }) => {
      const index = indexFromPath(pathname);
      this.setState({ index });
    });
  }

  changePage = () => {
    if (this.state.loading) return;

    const index = nextIndex(this.state.index);
    const page = pages[index];

    this.props.history.push(`/${page}`);
  };

  beforeChange = ({ isSync }) => {
    if (!isSync) {
      this.setState({ loading: true, error: false });
    }
  };

  afterChange = ({ isSync, isServer, isMount }) => {
    if (!isSync) {
      this.setState({ loading: false, error: false });
    } else if (!isServer && !isMount) {
      this.setState({ done: true, error: false });
    }
  };

  handleError = error => {
    this.setState({ error: true, loading: false });
  };

  buttonText() {
    const { loading, error } = this.state;
    if (error) return 'ERROR';
    return loading ? 'LOADING...' : 'CHANGE PAGE';
  }
  render() {
    const { index, done } = this.state;
    const page = pages[index];

    return (
      <div>
        {done && <div>all loaded ✔</div>}

        <UniversalComponent
          page={page}
          onBefore={this.beforeChange}
          onAfter={this.afterChange}
          onError={this.handleError}
        />

        <Button onClick={this.changePage}>{this.buttonText()}</Button>

        <p>
          <span>*why are you looking at this? refresh the page</span>
          <span>and view the source in Chrome for the real goods</span>
        </p>
      </div>
    );
  }
}

const Button = styled.button`background-color: green;`;
