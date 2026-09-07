import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    logout,
    hydrate,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    logout,
    hydrate,
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
  };
};
