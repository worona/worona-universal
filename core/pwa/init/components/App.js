import React from 'react'
import universal from 'react-universal-component'
import Loading from './Loading'
import NotFound from './NotFound'

const UniversalComponent = universal(props => import(`./${props.page}`), {
  loading: Loading,
  error: NotFound
})

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 'Baz' };
  }

  render() {
    return (
      <div  >
        <h1>Hello Reactlandia</h1>
        <UniversalComponent page={this.state.page} />
        <button onClick={() => this.setState({ page: 'Bar'})}>Change</button>
      </div>
    )
  }
}
