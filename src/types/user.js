// User type definitions
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager'
};

export const DEFAULT_USER = {
  id: null,
  username: 'MFakheem', // Default from App.jsx comment
  email: '',
  role: USER_ROLES.USER,
  isAuthenticated: false,
  permissions: []
};