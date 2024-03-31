import _ from "lodash";
import { call, put, takeLatest } from "redux-saga/effects";

import { FETCH_DEPARTMENT, FETCH_DEPARTMENT_SUCCESS } from "./actionTypes";
import { getDepartments } from "../../helpers/backend_helper";

function* fetchContainers({ payload }) {
  try {
    const { data } = yield call(getDepartments, {
      params: payload,
    });

    yield put({
      type: FETCH_DEPARTMENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_DEPARTMENT_SUCCESS,
      payload: [],
    });
  }
}

function* authSaga() {
  yield takeLatest(FETCH_DEPARTMENT, fetchContainers);
}

export default authSaga;
