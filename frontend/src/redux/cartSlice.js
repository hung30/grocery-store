import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalItems: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.cartItems.push(action.payload);
      state.totalItems += 1;
    },
    setCart(state, action) {
      state.cartItems = action.payload;
      state.totalItems = action.payload.length;
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalItems = 0;
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== action.payload
      );
      state.totalItems -= 1;
    },
  },
});

export const { addToCart, setCart, clearCart, removeFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
