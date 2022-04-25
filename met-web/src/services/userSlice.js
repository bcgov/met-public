import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bearerToken: "",
  roles: "",
  userDetail: {},
  isAuthenticated: null,
  currentPage: "",
  isAuthorized: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userToken: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.bearerToken = action.payload;
      localStorage.setItem("authToken", action.payload);
    },
    userRoles: (state, action) => {
      state.roles = action.payload;
    },
    userDetails: (state, action) => {
      state.userDetail = action.payload;
    },
    userAuthorization: (state, action) => {
      state.isAuthorized = action.payload;
    },
    userAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  userToken,
  userRoles,
  userDetails,
  userAuthorization,
  userAuthentication,
} = userSlice.actions;

export default userSlice.reducer;
