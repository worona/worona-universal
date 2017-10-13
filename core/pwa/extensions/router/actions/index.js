import * as types from '../types';

export const routeChangeRequested = ({ entityType, entityId }) => ({
  type: types.ROUTE_CHANGE_REQUESTED,
  entityType,
  entityId,
});
export const routeChanged = ({ pathname, entityType, entityId }) => ({
  type: types.ROUTE_CHANGED,
  pathname,
  entityType,
  entityId,
});
