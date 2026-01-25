import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../../services/apiClient";
import { setAuthFromLogin } from "./auth.slice";

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { dispatch, getState }) => {
    const response = await getRequest("/api/users/loginDetails");

    if (response?.userId) {
      const existingToken = getState().auth.authToken;

      dispatch(
        setAuthFromLogin({
          authToken: existingToken,
          userId: response.userId,
          mobileNo: response.mobile,
          name: response.name,
          email: response.email,
          profileLoaded: true,
        })
      );
    }

    return response;
  }
);
