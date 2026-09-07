import { appointments } from './api';

export const appointmentService = {
  create: async (data) => {
    const response = await appointments.create(data);
    return response.data;
  },

  getByUser: async (userId, role) => {
    const response = await appointments.getByUser(userId, role);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await appointments.updateStatus(id, status);
    return response.data;
  },
};
