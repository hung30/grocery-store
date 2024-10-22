import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginSuccess } from "./authSlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
if (userInfo) {
  store.dispatch(loginSuccess(userInfo));
}

export default store;
