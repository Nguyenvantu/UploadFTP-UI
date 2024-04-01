import { FETCH_CAMERA, FETCH_CAMERA_SUCCESS } from "./actionTypes";

const initialState = {
  data: [],
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CAMERA:
      state = {
        ...state,
        loading: true,
      };
      break;

    case FETCH_CAMERA_SUCCESS:
      state = {
        ...state,
        loading: false,
        data: action.payload || [],
      };
      break;

    default:
      break;
  }

  return state;
};

export default login;
