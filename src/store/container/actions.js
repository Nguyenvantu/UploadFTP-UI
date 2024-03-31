import { FETCH_CONTAINER, FETCH_CONTAINER_SUCCESS } from "./actionTypes";

export const getContainers = filter => {
  return {
    type: FETCH_CONTAINER,
    payload: filter,
  };
};
