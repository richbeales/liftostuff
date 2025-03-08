import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.liftostuff.com';
const API_PREFIX = `${API_URL}/api`;
const AUTH_PREFIX = `${API_URL}/auth`;

// Create axios instance
export const api = axios.create({
  baseURL: API_PREFIX,
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${AUTH_PREFIX}/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        });
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const loginWithGoogle = () => {
  window.location.href = `${AUTH_PREFIX}/login/google`;
};

export const logout = async () => {
  try {
    await api.post(`${AUTH_PREFIX}/logout`);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${AUTH_PREFIX}/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  });
  return response.data;
};

// Workout API calls
export const getWorkouts = async () => {
  const response = await api.get('/workouts');
  return response.data;
};

export const getWorkout = async (id) => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const response = await api.post('/workouts', workoutData);
  return response.data;
};

export const updateWorkout = async (id, workoutData) => {
  const response = await api.put(`/workouts/${id}`, workoutData);
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await api.delete(`/workouts/${id}`);
  return response.data;
};
