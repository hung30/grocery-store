import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginSuccess } from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
if (userInfo) {
  store.dispatch(loginSuccess(userInfo));
}

export default store;
