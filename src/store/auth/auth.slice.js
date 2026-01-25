import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,

  authToken: "",
  userId: "",
  customerId: "",

  mobileNo: "",
  isMobile: 0,

  roles: [],
  permissions: [],

  name: "",
  email: "",

  profileLoaded: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromLogin: (state, action) => {
      const data = action.payload;

      state.isAuthenticated = true;

      if (data.authToken) {
        state.authToken = data.authToken;
      }

      if (data.userId) {
        state.userId = data.userId;
      }

      if (data.customerId) {
        state.customerId = data.customerId;
      }

      if (data.mobileNo) {
        state.mobileNo = data.mobileNo;
      }

      state.isMobile = data.isMobile ?? state.isMobile;

      state.roles = data.roles || state.roles;
      state.permissions = data.permissions || state.permissions;

      state.name = data.name || state.name;
      state.email = data.email || state.email;
      state.mobileNo = data.mobileNo || state.mobileNo;

      state.profileLoaded = true;
    },

    logout: () => initialState
  }
});

export const { setAuthFromLogin, logout } = authSlice.actions;
export default authSlice.reducer;
