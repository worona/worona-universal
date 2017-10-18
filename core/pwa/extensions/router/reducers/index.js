import { combineReducers } from 'redux';
import * as types from '../types';

export const currentType = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGE_SUCCEED) return action.currentType || null;
  return state;
};

export const currentId = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGE_SUCCEED) return action.currentId || null;
  return state;
};

export const pathname = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGE_SUCCEED) return action.pathname || null;
  return state;
};

export default combineReducers({
  currentType,
  currentId,
  pathname,
});
