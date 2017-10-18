import { fork, take, takeEvery, put, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import createHistory from 'history/createBrowserHistory'
import worona from 'worona-deps';
import * as actions from '../actions';
import * as types from '../types';
// import gtmSagas from './gtm';

let history;


const getPathname = ({ currentType, currentId }) => `/dummypath/${currentType}/${currentId}`;

const routeChanged = () =>
  eventChannel(emitter => {
    const unlisten = history.listen(location => {
      console.log('INSIDE LISTEN');
      const { pathname, state } = location;
      emitter({ pathname, ...state });
    })
    return unlisten;
  });

function* routeChangeSaga() {

  yield take('build/CLIENT_SAGAS_INITIALIZED');
  history = createHistory();
  worona.history = history;

  // Initializate router event channels.
  const routeChangedEvents = routeChanged();

  // Track router events and dispatch them to redux.
  yield takeEvery(routeChangedEvents, function* handleChange(changed) {
    yield put(actions.routeChangeSucceed(changed));
  })

  yield takeEvery(types.ROUTE_CHANGE_REQUESTED, requested => {
    const { currentType } = requested;

    if (currentType === 'back') history.goBack();
    else if (currentType === 'forward') history.goForward();
    else {
      history.push(getPathname(requested), requested);
      console.log('JUST AFTER PUSH');
      // window.scrollTo(0,0);
    }
  });
}

export default function* routerClientSagas() {
  yield all([
    fork(routeChangeSaga),
    // fork(gtmSagas),
  ]);
}
