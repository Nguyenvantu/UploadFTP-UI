import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";

// export const API_URL = `https://ftp.sitcgn.com/api`;
export const API_URL = `http://localhost:3030/api`;
export const WS_URL = `http://localhost:3030`;
// export const API_URL = `/api`;
// export const WS_URL = ``;

const axiosApi = axios.create({
  baseURL: API_URL,
});

export const setToken = token =>
  (axiosApi.defaults.headers.common["authentication"] = token || accessToken());

setToken();

axiosApi.interceptors.response.use(
  response => response?.data,
  error => {
    if (
      error?.response?.status === 401 &&
      error?.response?.config?.url !== "/login"
    ) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error?.response?.data);
  }
);

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config });
}

export async function post(url, data, config = {}) {
  return axiosApi.post(url, { ...data }, { ...config });
}

export async function postFromData(url, data, config = {}) {
  return axiosApi.post(url, data, { ...config });
}

export async function put(url, data, config = {}) {
  return axiosApi.put(url, { ...data }, { ...config });
}

export async function del(url, config = {}) {
  return await axiosApi.delete(url, { ...config });
}
