import api from './api';
import { UserProfile } from '../types';

export const userService = {
  getProfile: () => api.get<UserProfile>('/api/users/profile'),
};
