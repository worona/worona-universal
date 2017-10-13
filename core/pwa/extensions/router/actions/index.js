import * as types from '../types';

export const routeChangeRequested = ({ currentType, currentId }) => ({
  type: types.ROUTE_CHANGE_REQUESTED,
  currentType,
  currentId,
});
export const routeChanged = ({ pathname, currentType, currentId }) => ({
  type: types.ROUTE_CHANGED,
  pathname,
  currentType,
  currentId,
});
