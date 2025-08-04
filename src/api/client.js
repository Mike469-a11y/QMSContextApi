// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// API Error class
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Base fetch wrapper with error handling
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authentication header if available
  const token = localStorage.getItem('qms_token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle non-JSON responses (like file downloads)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
};

// HTTP methods
export const api = {
  get: (endpoint, options = {}) => apiFetch(endpoint, { method: 'GET', ...options }),
  post: (endpoint, data, options = {}) => apiFetch(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data), 
    ...options 
  }),
  put: (endpoint, data, options = {}) => apiFetch(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data), 
    ...options 
  }),
  patch: (endpoint, data, options = {}) => apiFetch(endpoint, { 
    method: 'PATCH', 
    body: JSON.stringify(data), 
    ...options 
  }),
  delete: (endpoint, options = {}) => apiFetch(endpoint, { method: 'DELETE', ...options }),
};

export default api;