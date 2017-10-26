import { fork, take, takeEvery, put, all, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import worona from 'worona-deps';
import * as actions from '../actions';
import * as types from '../types';
import * as selectors from '../selectors';
// import gtmSagas from './gtm';

let history;

const getPathname = ({ currentType, currentId }) => `/dummypath/${currentType}/${currentId}`;

const routeChanged = () =>
  eventChannel(emitter => {
    const unlisten = history.listen(location => {
      const { pathname, state } = location;
      emitter({ pathname, ...state });
    });
    return unlisten;
  });

function* routeChangeSaga() {
  yield take('build/CLIENT_SAGAS_INITIALIZED');
  history = createHistory();
  worona.history = history;

  // Appropriately replaces current path.
  const currentType = yield select(selectors.getType);
  const currentId = yield select(selectors.getId);
  const routeParams = { currentType, currentId };
  history.replace(getPathname(routeParams), routeParams);

  // Initializate router event channels.
  const routeChangedEvents = routeChanged();

  // Track router events and dispatch them to redux.
  yield takeEvery(routeChangedEvents, function* handleChange(changed) {
    yield put(actions.routeChangeSucceed(changed));
  });

  yield takeEvery(types.ROUTE_CHANGE_REQUESTED, requested => {
    history.push(getPathname(requested), requested);
  });
}

export default function* routerClientSagas() {
  yield all([
    fork(routeChangeSaga),
    // fork(gtmSagas),
  ]);
}
