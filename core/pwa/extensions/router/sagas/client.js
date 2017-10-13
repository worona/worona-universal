import { fork, take, put, race, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import createHistory from 'history/createMemoryHistory'
import * as actions from '../actions';
import * as types from '../types';
import gtmSagas from './gtm';

const history = createHistory();

const getPathname = (type, id) => `dummypath/${type}/${id}`;

const routeChanged = () =>
  eventChannel(emitter => {
    const unlisten = history.listen((location, action) => {
      const { pathname } = location;
      const { type, id } = action;
      emitter({ pathname, type, id });
    })
    return unlisten;
  });

function* routeChangeSaga() {
  // Initializate router event channels.
  const routeChangedEvents = routeChanged();

  // Track router events and dispatch them to redux.
  while (true) {
    const { requested, changed } = yield race({
      requested: take(types.ROUTE_CHANGE_REQUESTED),
      changed: take(routeChangedEvents),
    });
    if (requested) {
      const type = requested.entityType;
      const id = requested.entityId;
      history.push(getPathname(type, id), {type, id})
    } else if (changed) {
      yield put(actions.routeChanged(changed));
    }
  }
}

export default function* routerClientSagas() {
  yield all([
    fork(routeChangeSaga),
    fork(gtmSagas),
  ]);
}
