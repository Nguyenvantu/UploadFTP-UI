import { FETCH_USER } from "./actionTypes";

export const getUsers = filter => {
  return {
    type: FETCH_USER,
    payload: filter,
  };
};
