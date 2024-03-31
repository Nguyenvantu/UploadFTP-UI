import jwtDecode from "jwt-decode";

import accessToken from "../../../helpers/jwt-token-access/accessToken";
import { LOGIN_USER, LOGIN_SUCCESS, API_ERROR } from "./actionTypes";

const initialState = {
  error: "",
  token: "",
  user: {},
  isLoggedIn: false,
  loading: false,
};

try {
  const token = accessToken();
  const user = jwtDecode(token);

  initialState.token = token;
  initialState.user = user;
  initialState.isLoggedIn = !!user && !!user.username;
} catch (e) {
  console.error(e);
  localStorage.removeItem("token");
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;

    case LOGIN_SUCCESS:
      state = {
        ...state,
        ...action.payload,
        isLoggedIn: true,
        loading: false,
      };
      break;

    case API_ERROR:
      state = { ...state, error: action.payload, loading: false };
      break;

    default:
      break;
  }

  return state;
};

export default login;
