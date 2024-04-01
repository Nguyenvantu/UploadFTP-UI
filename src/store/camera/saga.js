import _ from "lodash";
import { call, put, takeLatest } from "redux-saga/effects";

import { FETCH_CAMERA, FETCH_CAMERA_SUCCESS } from "./actionTypes";
import { getCameraGroups } from "../../helpers/backend_helper";

function* fetchCameras({ payload }) {
  try {
    const { data } = yield call(getCameraGroups, {
      params: payload,
    });

    yield put({
      type: FETCH_CAMERA_SUCCESS,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: FETCH_CAMERA_SUCCESS,
      payload: [],
    });
  }
}

function* authSaga() {
  yield takeLatest(FETCH_CAMERA, fetchCameras);
}

export default authSaga;
