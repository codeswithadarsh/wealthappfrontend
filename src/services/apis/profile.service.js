import { getRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchUserProfile = (payload) => {
   return getRequest(API_ROUTES.USER_PROFILE, payload)
};
