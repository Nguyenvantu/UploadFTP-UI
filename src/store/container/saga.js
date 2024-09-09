import { call, put, takeLatest } from "redux-saga/effects";

import { FETCH_CONTAINER, FETCH_CONTAINER_SUCCESS } from "./actionTypes";
import { getContainers } from "../../helpers/backend_helper";

function* fetchContainers({ payload }) {
  try {
    const { data, total } = yield call(getContainers, {
      params: payload,
    });

    yield put({
      type: FETCH_CONTAINER_SUCCESS,
      payload: { data, total },
    });
  } catch (error) {
    yield put({
      type: FETCH_CONTAINER_SUCCESS,
      payload: { data: [], total: 0 },
    });
  }
}

function* authSaga() {
  yield takeLatest(FETCH_CONTAINER, fetchContainers);
}

export default authSaga;
