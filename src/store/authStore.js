import { create } from 'zustand';
import supabase from '../lib/supabaseClient';

const isAdminToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.type === 'careconnect_admin' && payload.role === 'admin';
  } catch {
    return false;
  }
};

export const useAuthStore = create(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true, // Start as true for hydration
    doctorProfile: null,
    profileComplete: false, // Default to false, must be explicitly set true
    isHydrated: false,

      signup: async (credentials) => {
        set({ loading: true });
        try {
          // Get the role selected for this browser session.
          const role = sessionStorage.getItem('signup_role') || 'patient';

          // Clear all stale auth data before signup
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth-storage');

          // Prepare request body - MATCH BACKEND EXACTLY
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
            
            // Provide more specific error messages
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

          // Store auth token if provided
          if (data.session?.access_token) {
            localStorage.setItem('auth_token', data.session.access_token);
          }
          localStorage.removeItem('admin_session');
          sessionStorage.removeItem('signup_role');

          // Store user data
          set({
            user: {
              id: data.userId,
              email: credentials.email,
              full_name: credentials.fullName,
              role: role,
              avatar: '🐱', // Default avatar
            },
            isAuthenticated: true,
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

          // Store auth token
          if (data.session?.access_token) {
            localStorage.setItem('auth_token', data.session.access_token);
          }
          localStorage.removeItem('admin_session');
          sessionStorage.removeItem('signup_role');

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
          // Prevent an older Supabase session from winning during hydration.
          await supabase.auth.signOut();

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

          if (data.session?.access_token) {
            localStorage.setItem('auth_token', data.session.access_token);
          }
          localStorage.setItem('admin_session', 'true');
          sessionStorage.removeItem('signup_role');

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
          // Store the intended role for after OAuth callback
          sessionStorage.setItem('signup_role', role);

          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
              skipBrowserRedirect: false,
            },
          });

          if (error) throw error;

          // The OAuth flow will redirect the user
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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('signup_role');
        sessionStorage.removeItem('signup_role');
        sessionStorage.removeItem('auth_redirect');
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

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/${user.id}/profile`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              },
              body: JSON.stringify(profileData),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Profile update failed');
          }

          const data = await response.json();
          
          // Update user in store
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

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/${user.id}/profile`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
          
          // Update user and set profileComplete to true
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
        await supabase.auth.signOut();
        // Clear all local storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('admin_session');
        sessionStorage.removeItem('signup_role');
        localStorage.removeItem('signup_role');
        
        // Reset state
        set({
          user: null,
          isAuthenticated: false,
          doctorProfile: null,
          profileComplete: false,
          isHydrated: true,
        });
        
        // Use replace to prevent browser back button from returning to protected routes
        if (typeof window !== 'undefined') {
          window.location.replace('/');
        }
      },

      hydrate: async () => {
        try {
          // Check current Supabase session
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error('Session check error:', error);
            set({ loading: false, isHydrated: true });
            return;
          }

          const storedToken = localStorage.getItem('auth_token');
          const accessToken = (localStorage.getItem('admin_session') === 'true' || isAdminToken(storedToken))
            ? storedToken
            : session?.access_token || storedToken;

          if (accessToken) {
            // Try to validate with backend, but don't fail if backend is unavailable
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/validate`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                  },
                  signal: controller.signal,
                }
              );

              clearTimeout(timeoutId);

              if (response.ok) {
                const data = await response.json();
                set({
                  user: data.user,
                  isAuthenticated: true,
                  doctorProfile: data.doctorProfile || null,
                  profileComplete: data.profileComplete !== undefined ? data.profileComplete : false,
                  loading: false,
                  isHydrated: true,
                });
                localStorage.setItem('auth_token', accessToken);
                return;
              }
            } catch (fetchError) {
              // Backend validation failed or timed out - continue with local session
              console.log('Backend validation unavailable, using local session');
            }

            // If backend validation fails, try to get user data from Supabase session
            if (session?.user) {
              set({
                user: {
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                  role: session.user.user_metadata?.role || 'patient',
                  avatar: session.user.user_metadata?.avatar || '🐱',
                },
                isAuthenticated: true,
                doctorProfile: null,
                profileComplete: false,
                loading: false,
                isHydrated: true,
              });
              localStorage.setItem('auth_token', session.access_token);
            } else if (storedToken) {
              // Fallback: keep user authenticated with stored token
              // This allows the app to work even if backend is temporarily down
              set({
                user: {
                  id: 'local',
                  email: 'user@local',
                  full_name: 'User',
                  role: 'patient',
                  avatar: '🐱',
                },
                isAuthenticated: true,
                doctorProfile: null,
                profileComplete: false,
                loading: false,
                isHydrated: true,
              });
            } else {
              set({ loading: false, isHydrated: true });
            }
          } else {
            // No session
            set({ loading: false, isHydrated: true });
          }
        } catch (error) {
          console.error('Hydration error:', error);
          set({ loading: false, isHydrated: true });
        }
      },
    })
);