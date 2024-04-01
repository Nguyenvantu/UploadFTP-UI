import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";

import Container from "./container/reducer";
import User from "./user/reducer";
import Department from "./department/reducer";
import CameraGroup from "./camera/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Container,
  User,
  Department,
  CameraGroup,
});

export default rootReducer;
