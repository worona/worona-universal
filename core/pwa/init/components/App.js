import React from 'react'
import universal from 'react-universal-component'
import Loading from './Loading'
import NotFound from './NotFound'

const UniversalComponent = universal(props => import(`../../../../packages/${props.page}/src/pwa`), {
  loading: Loading,
  error: NotFound
})

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 'general-app-extension-worona' };
  }

  render() {
    return (
      <div  >
        <h1>Hello Reactlandia</h1>
        <UniversalComponent page={this.state.page} />
        <button onClick={() => this.setState({ page: 'saturn-app-theme-worona'})}>Change</button>
      </div>
    )
  }
}
