import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://api.liftostuff.com';

export const api = axios.create({
  baseURL: API_URL
});

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
