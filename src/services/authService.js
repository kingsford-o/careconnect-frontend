import { auth } from './api';

export const authService = {
  signup: async (email, password, fullName, role) => {
    const response = await auth.signup(email, password, fullName, role);
    return response.data;
  },

  login: async (email, password) => {
    const response = await auth.login(email, password);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};
