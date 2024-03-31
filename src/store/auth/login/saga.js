import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import jwtDecode from "jwt-decode";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, CHECK_TOKEN } from "./actionTypes";
import { apiError, loginSuccess } from "./actions";
import { setToken } from "../../../helpers/api_helper";
import { postJwtLogin } from "../../../helpers/backend_helper";

function* loginUser({ payload: { user, history } }) {
  try {
    const { success, data, message } = yield call(postJwtLogin, {
      username: user.username,
      password: user.password,
    });

    if (success) {
      // localStorage.setItem("authUser", JSON.stringify(userSuccess));
      localStorage.setItem("token", data.token);
      setToken(data.token);
      yield put(loginSuccess({ token: data.token, user: data.user }));
      history.push("/");
    } else {
      yield put(apiError(message || "Thông tin đăng nhập sai!"));
    }
  } catch (error) {
    yield put(apiError("Thông tin đăng nhập sai!"));
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("token");
    window.location.href = "/login";
  } catch (error) {
    yield put(apiError(error));
  }
}

function* checkToken() {
  try {
    const token = localStorage.getItem("token");
    const user = jwtDecode(token);

    yield put(loginSuccess({ token, user }));
  } catch (error) {
    localStorage.removeItem("token");
    // window.location.href = "/login";
  }
}

function* authSaga() {
  yield takeLatest(LOGIN_USER, loginUser);
  yield takeLatest(CHECK_TOKEN, checkToken);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
