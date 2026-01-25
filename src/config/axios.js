import axios from "axios";
import { ENV } from "./env";
import { store } from "../store";


const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});


axiosInstance.interceptors.request.use(
  config => {

    const state = store.getState();
    const token = state.auth?.authToken;

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  response => response.data,
  error => {

    if (error.response && error.response.status === 401) {
      store.dispatch({ type: "auth/logout" });
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
