import { ratings } from './api';

export const ratingService = {
  create: async (data) => {
    const response = await ratings.create(data);
    return response.data;
  },

  getByDoctor: async (doctorId) => {
    const response = await ratings.getByDoctor(doctorId);
    return response.data;
  },
};
