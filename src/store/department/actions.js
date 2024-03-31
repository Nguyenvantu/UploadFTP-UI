import { FETCH_DEPARTMENT } from "./actionTypes";

export const getDepartments = filter => {
  return {
    type: FETCH_DEPARTMENT,
    payload: filter,
  };
};
