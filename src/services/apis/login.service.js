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

export const forgotPassword = (payload) => {
  return postRequest(API_ROUTES.FORGET_PASSWORD, payload)
}

export const resetPassword = (payload) => {
  return postRequest(API_ROUTES.RESET_PASSWORD, payload)
}
