import { FETCH_CAMERA } from "./actionTypes";

export const getCameraGroups = filter => {
  return {
    type: FETCH_CAMERA,
    payload: filter,
  };
};
