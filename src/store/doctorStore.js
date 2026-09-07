import { create } from 'zustand';

export const useDoctorStore = create((set, get) => ({
  doctors: [],
  currentDoctor: null,
  loading: false,

  setDoctors: (doctors) => set({ doctors }),
  
  setCurrentDoctor: (doctor) => set({ currentDoctor: doctor }),

  addDoctor: (doctor) => set((state) => ({
    doctors: [...state.doctors, doctor]
  })),

  updateDoctor: (id, updates) => set((state) => ({
    doctors: state.doctors.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    )
  })),

  setLoading: (loading) => set({ loading }),
}));
