import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: localStorage.getItem("darkMode") === "true" ? true : false,
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
      localStorage.setItem("darkMode", state.darkMode);
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
