import { combineReducers } from 'redux';
import * as types from '../types';

export const type = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGED) return action.entityType;
  return state;
};

export const id = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGED) return action.entityId;
  return state;
};

export const pathname = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGED) return action.pathname;
  return state;
};

export default combineReducers({
  type,
  id,
  pathname,
});
