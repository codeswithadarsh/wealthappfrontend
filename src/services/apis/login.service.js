import { postRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchUserExists = (payload) => {
  return postRequest(API_ROUTES.USER_EXIST_CHECK, payload)
};

export const userLogin = (payload) => {
  return postRequest(API_ROUTES.USER_LOGIN, payload)
};

export const userRegister = (payload) => {
  return postRequest(API_ROUTES.USER_Register, payload)
};