import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authorized: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    authorize: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.authorized = true;
    },
    deauthorize: (state) => {
      state.authorized = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { authorize, deauthorize } = loginSlice.actions;

export default loginSlice.reducer;
