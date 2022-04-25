import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./components/Login/loginSlice";
import userSlice from "./services/userSlice";

export const store = configureStore({
  reducer: {
    auth: loginReducer,
    user: userSlice,
  },
});
