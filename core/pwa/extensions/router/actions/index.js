import * as types from '../types';

export const routeChangeRequested = ({ currentType, currentId }) => ({
  type: types.ROUTE_CHANGE_REQUESTED,
  currentType,
  currentId,
});
export const routeChangeSucceed = ({ pathname, currentType, currentId }) => ({
  type: types.ROUTE_CHANGE_SUCCEED,
  pathname,
  currentType,
  currentId,
});
