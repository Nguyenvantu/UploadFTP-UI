import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Edit profile
const postJwtProfile = data => post(url.POST_EDIT_JWT_PROFILE, data);

// Register Method
const postJwtRegister = data => {
  return axios.post(url.POST_JWT_REGISTER, data);
};
// Login Method
const postJwtLogin = data => post(url.POST_JWT_LOGIN, data);

const getContainers = configs => get(url.CONTAINER, configs);

const getUsers = configs => get(url.USER, configs);

const getDepartments = configs => get(url.DEPARTMENT, configs);

export {
  getLoggedInUser,
  isUserAuthenticated,
  postJwtRegister,
  postJwtLogin,
  postJwtProfile,
  getContainers,
  getUsers,
  getDepartments,
};
