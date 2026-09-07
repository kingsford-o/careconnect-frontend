import { doctors } from './api';

export const doctorService = {
  getAll: async (params) => {
    const response = await doctors.getAll(params);
    return response.data;
  },

  getById: async (id) => {
    const response = await doctors.getById(id);
    return response.data;
  },

  createProfile: async (profileData) => {
    const response = await doctors.create('/api/doctors/profile', profileData);
    return response.data;
  },
};
