// import _ from "lodash";
import { call, put, takeLatest } from "redux-saga/effects";

import { FETCH_USER, FETCH_USER_SUCCESS } from "./actionTypes";
import { getUsers } from "../../helpers/backend_helper";

function* fetchUsers({ payload }) {
  try {
    const { data } = yield call(getUsers, {
      params: payload,
    });

    yield put({
      type: FETCH_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_USER_SUCCESS,
      payload: [],
    });
  }
}

function* authSaga() {
  yield takeLatest(FETCH_USER, fetchUsers);
}

export default authSaga;
