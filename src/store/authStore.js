import { create } from 'zustand';
import supabase from '../lib/supabaseClient';

export const useAuthStore = create(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    doctorProfile: null,
    profileComplete: false,
    isHydrated: false,

    setUser: (userData) => {
      set({
        user: userData,
        isAuthenticated: true,
        isHydrated: true,
        loading: false,
      });
    },

    signup: async (credentials) => {
      set({ loading: true });
      try {
        const role = credentials.role || 'patient';

        const payload = {
          email: credentials.email,
          password: credentials.password,
          fullName: credentials.fullName,
          role: role,
          verificationCode: credentials.verificationCode,
        };

        console.log('📤 Sending signup request:', payload);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/signup`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
          const error = await response.json();
          console.error('❌ Signup error:', error);

          if (error.error?.includes('duplicate key') || error.error?.includes('unique constraint')) {
            if (error.error?.includes('users_pkey')) {
              throw new Error('Database error: User ID conflict. Please try again with a different approach or contact support.');
            }
            throw new Error('This email is already registered. Please use a different email or sign in.');
          } else if (error.error?.includes('users_pkey')) {
            throw new Error('Database error occurred. Please try again or clear your browser cache.');
          }

          throw new Error(error.error || 'Signup failed');
        }

        const data = await response.json();
        console.log('✅ Signup success:', data);

        // NO STORAGE - Don't store token for security
        // Token will be used in memory only during session

        set({
          user: {
            id: data.userId,
            email: credentials.email,
            full_name: credentials.fullName,
            role: role,
            avatar: '🐱',
          },
          isAuthenticated: true,
          isHydrated: true,
        });

        return data;
      } catch (error) {
        console.error('❌ Signup exception:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    login: async (email, password, selectedRole = 'patient') => {
      set({ loading: true });
      try {
        const payload = { email, password, role: selectedRole };

        console.log('📤 Sending login request:', payload);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
          const error = await response.json();
          console.error('❌ Login error:', error);
          throw new Error(error.error || 'Invalid credentials');
        }

        const data = await response.json();
        console.log('✅ Login success:', data);

        // NO STORAGE - Don't store token for security
        // Token will be used in memory only during session

        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            full_name: data.profile?.full_name || data.user.email,
            role: data.role,
            profile_image_url: data.profile?.profile_image_url,
            avatar: data.profile?.profile_image_url || '🐱',
          },
          isAuthenticated: true,
          doctorProfile: data.doctorProfile || null,
          profileComplete: data.profileComplete !== undefined ? data.profileComplete : true,
          isHydrated: true,
        });

        return data;
      } catch (error) {
        console.error('❌ Login exception:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    adminLogin: async (passkey) => {
      set({ loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/admin/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passkey }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Admin authentication failed');
        }

        // NO STORAGE - Don't store token for security
        // Token will be used in memory only during session

        set({
          user: data.user,
          isAuthenticated: true,
          doctorProfile: null,
          profileComplete: true,
          isHydrated: true,
        });

        return data;
      } finally {
        set({ loading: false });
      }
    },

    signInWithGoogle: async (role = 'patient') => {
      set({ loading: true });
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
            skipBrowserRedirect: false,
          },
        });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('❌ Google OAuth exception:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    resetForRoleSelection: async () => {
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        sessionStorage.clear();
      }
      set({
        user: null,
        isAuthenticated: false,
        doctorProfile: null,
        profileComplete: false,
        isHydrated: true,
        loading: false,
      });
    },

    updateProfile: async (profileData) => {
      set({ loading: true });
      try {
        const user = get().user;
        if (!user) throw new Error('User not authenticated');

        // Get Supabase session for auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}/profile`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(profileData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Profile update failed');
        }

        const data = await response.json();
        
        set({
          user: {
            ...user,
            ...data.user,
            avatar: profileData.avatar || user.avatar,
          },
        });

        return data;
      } catch (error) {
        console.error('❌ Update profile exception:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    completeDoctorProfile: async (profileData) => {
      set({ loading: true });
      try {
        const user = get().user;
        if (!user) throw new Error('User not authenticated');

        // Get Supabase session for auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}/profile`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(profileData),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Profile completion failed');
        }

        const data = await response.json();
        console.log('✅ Doctor profile completed:', data);
        
        set({
          user: {
            ...user,
            ...data.user,
          },
          doctorProfile: data.doctorProfile || profileData,
          profileComplete: true,
        });

        return data;
      } catch (error) {
        console.error('❌ Complete doctor profile exception:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    logout: async () => {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Signout warning:', e);
      }
      
      // Clear any remaining storage for cleanup
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        sessionStorage.clear();
      }

      set({
        user: null,
        isAuthenticated: false,
        doctorProfile: null,
        profileComplete: false,
        isHydrated: true,
        loading: false,
      });

      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },

    hydrate: async () => {
      // NO AUTO-HYDRATION - Don't automatically restore sessions from storage
      // Users must explicitly log in each session for security
      set({
        user: null,
        isAuthenticated: false,
        doctorProfile: null,
        profileComplete: false,
        loading: false,
        isHydrated: true,
      });
    },
  })
);
