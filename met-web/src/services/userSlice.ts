import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserState = {
  bearerToken: '',
  roles: [],
  userDetail: {
    sub: '',
    email_verified: false,
    preferred_username: '',
  },
  authentication: {
    authenticated: false,
    loading: true,
  },
  currentPage: '',
  isAuthorized: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userToken: (state, action: PayloadAction<string | undefined>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.bearerToken = action.payload;
    },
    userRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
    },
    userDetails: (state, action: PayloadAction<UserDetail>) => {
      state.userDetail = action.payload;
    },
    userAuthorization: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    userAuthentication: (state, action: PayloadAction<boolean>) => {
      state.authentication = {
        authenticated: action.payload,
        loading: false,
      };
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
