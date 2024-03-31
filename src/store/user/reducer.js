import { FETCH_USER, FETCH_USER_SUCCESS } from "./actionTypes";

const initialState = {
  data: [],
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      state = {
        ...state,
        loading: true,
      };
      break;

    case FETCH_USER_SUCCESS:
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
