import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalLoader: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoader: state => {
      state.globalLoader = true;
    },
    hideLoader: state => {
      state.globalLoader = false;
    }
  }
});

export const { showLoader, hideLoader } = uiSlice.actions;
export default uiSlice.reducer;
