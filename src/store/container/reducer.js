import { FETCH_CONTAINER, FETCH_CONTAINER_SUCCESS } from "./actionTypes";

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTAINER:
      state = {
        ...state,
        loading: true,
      };
      break;

    case FETCH_CONTAINER_SUCCESS:
      state = {
        ...state,
        loading: false,
        data: action.payload.data || [],
        total: action.payload.total || 0,
      };
      break;

    default:
      break;
  }

  return state;
};

export default login;
