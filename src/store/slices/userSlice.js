import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_USER } from '../../types/user.js';

// Initial state based on the existing UserContext pattern
const initialState = {
  user: DEFAULT_USER,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...action.payload, isAuthenticated: true };
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.error = null;
    },
    logout: (state) => {
      state.user = DEFAULT_USER;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, updateUser, logout, setLoading, setError } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectIsAuthenticated = (state) => state.user.user.isAuthenticated;

export default userSlice.reducer;