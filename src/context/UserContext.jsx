import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { 
  setUser, 
  updateUser, 
  logout, 
  setLoading, 
  setError,
  selectUser,
  selectUserLoading,
  selectUserError,
  selectIsAuthenticated
} from '../store/slices/userSlice.js';
import { DEFAULT_USER } from '../types/user.js';

// User Context - now using Redux for state management
const UserContext = createContext(null);

// UserProvider component that bridges Redux with Context API
export const UserProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Initialize user from localStorage or default
  useEffect(() => {
    const savedUser = localStorage.getItem('qms_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('qms_user');
        // Set default user as authenticated
        dispatch(setUser({ 
          ...DEFAULT_USER, 
          id: 1, 
          username: 'MFakheem',
          isAuthenticated: true 
        }));
      }
    } else {
      // Set default user as authenticated for now
      dispatch(setUser({ 
        ...DEFAULT_USER, 
        id: 1, 
        username: 'MFakheem',
        isAuthenticated: true 
      }));
    }
  }, [dispatch]);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('qms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qms_user');
    }
  }, [user, isAuthenticated]);

  // Action creators wrapped for easy access
  const setUserData = (userData) => {
    dispatch(setUser(userData));
  };

  const updateUserData = (updates) => {
    dispatch(updateUser(updates));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const setUserLoading = (loadingState) => {
    dispatch(setLoading(loadingState));
  };

  const setUserError = (errorState) => {
    dispatch(setError(errorState));
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    setUser: setUserData,
    updateUser: updateUserData,
    logout: logoutUser,
    setLoading: setUserLoading,
    setError: setUserError
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use UserContext - maintains the same interface
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;