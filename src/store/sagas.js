import { all, fork } from "redux-saga/effects";

//public
import AuthSaga from "./auth/login/saga";

import LayoutSaga from "./layout/saga";

import ContainerSaga from "./container/saga";
import UserSaga from "./user/saga";
import DepartmentSaga from "./department/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AuthSaga),
    fork(LayoutSaga),
    fork(ContainerSaga),
    fork(UserSaga),
    fork(DepartmentSaga),
  ]);
}
