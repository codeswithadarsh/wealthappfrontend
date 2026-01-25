export const selectAuth = state => state.auth;

export const selectIsAuthenticated = state =>
  state.auth.isAuthenticated;

export const selectAuthToken = state =>
  state.auth.authToken;

export const selectUserId = state =>
  state.auth.userId;

export const selectCustomerId = state =>
  state.auth.customerId;

export const selectProfileLoaded = state =>
  state.auth.profileLoaded;

export const selectUserName = state => state.auth.name;
export const selectUserEmail = state => state.auth.email;
export const selectUserMobileNo = state => state.auth.mobileNo;

