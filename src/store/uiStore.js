import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      toast: null,
      modal: null,
      isDarkMode: false,
      isSidebarClosed: false,
      
      showToast: (message, type = 'info') => set({
        toast: { message, type, id: Date.now() }
      }),

      hideToast: () => set({ toast: null }),

      showModal: (modal) => set({ modal }),

      hideModal: () => set({ modal: null }),

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),

      toggleSidebar: () => set((state) => ({ isSidebarClosed: !state.isSidebarClosed })),

      closeSidebar: () => set({ isSidebarClosed: true }),

      openSidebar: () => set({ isSidebarClosed: false }),

      initializeTheme: () => {
        const stored = get().isDarkMode;
        if (stored === null || stored === undefined) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ isDarkMode: prefersDark });
        }
      },
    }),
    {
      name: 'ui-storage',
    }
  )
);
