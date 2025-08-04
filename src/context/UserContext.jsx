import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DEFAULT_USER } from '../types/user.js';

// User Context
const UserContext = createContext(null);

// User actions
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// User reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: { ...action.payload, isAuthenticated: true },
        loading: false,
        error: null
      };
    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null
      };
    case USER_ACTIONS.LOGOUT:
      return {
        ...state,
        user: DEFAULT_USER,
        loading: false,
        error: null
      };
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: DEFAULT_USER,
  loading: false,
  error: null
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Initialize user from localStorage or default
  useEffect(() => {
    const savedUser = localStorage.getItem('qms_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('qms_user');
      }
    } else {
      // Set default user as authenticated for now (based on the comment in App.jsx)
      dispatch({ 
        type: USER_ACTIONS.SET_USER, 
        payload: { 
          ...DEFAULT_USER, 
          id: 1, 
          username: 'MFakheem',
          isAuthenticated: true 
        } 
      });
    }
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (state.user.isAuthenticated) {
      localStorage.setItem('qms_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('qms_user');
    }
  }, [state.user]);

  const setUser = (user) => {
    dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
  };

  const updateUser = (updates) => {
    dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: updates });
  };

  const logout = () => {
    dispatch({ type: USER_ACTIONS.LOGOUT });
  };

  const setLoading = (loading) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error });
  };

  const value = {
    ...state,
    setUser,
    updateUser,
    logout,
    setLoading,
    setError
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;