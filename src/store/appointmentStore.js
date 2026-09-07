import { create } from 'zustand';

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  currentAppointment: null,
  loading: false,

  setAppointments: (appointments) => set({ appointments }),
  
  setCurrentAppointment: (appointment) => set({ currentAppointment: appointment }),

  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, appointment]
  })),

  updateAppointment: (id, updates) => set((state) => ({
    appointments: state.appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    )
  })),

  removeAppointment: (id) => set((state) => ({
    appointments: state.appointments.filter(apt => apt.id !== id)
  })),

  setLoading: (loading) => set({ loading }),
}));
