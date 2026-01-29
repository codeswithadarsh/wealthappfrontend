import { getRequest, deleteRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchUserProfile = (payload) => {
   return getRequest(API_ROUTES.USER_PROFILE, payload)
};

export const deleteUserAccount = (payload) => {
   return deleteRequest(API_ROUTES.DELETE_USER_Account, payload)
};
