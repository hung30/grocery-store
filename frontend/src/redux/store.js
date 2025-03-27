import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginSuccess } from "./authSlice";
import cartReducer from "./cartSlice";
import darkModeReducer from "./darkModeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    darkMode: darkModeReducer,
  },
});

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
if (userInfo) {
  store.dispatch(loginSuccess(userInfo));
}

export default store;
