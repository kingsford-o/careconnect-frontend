import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import FloatingThemeToggle from './components/shared/FloatingThemeToggle';
import AppShell from './components/shared/AppShell';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/design-system.css';
import './styles/globals.css';
import './styles/colors.css';
import './styles/typography.css';
import './styles/typography-premium.css';
import './styles/responsive.css';
import './styles/components.css';
import './styles/auth.css';
import './styles/auth-premium.css';
import './styles/patient.css';
import './styles/patient-dashboard-premium.css';
import './styles/doctor.css';
import './styles/doctor-dashboard-premium.css';
import './styles/doctor-card-premium.css';
import './styles/widgets-premium.css';
import './styles/empty-states-premium.css';
import './styles/animations-premium.css';
import './styles/navigation-premium.css';
import './styles/features-premium.css';
import './styles/contact-premium.css';
import './styles/booking-premium.css';
import './styles/appointments-premium.css';
import './styles/landing.css';
import './styles/landing-premium.css';
import './styles/footer.css';
import './styles/back-to-home.css';
import './styles/profile-edit.css';
import './styles/admin-dashboard-premium.css';
import './styles/error-boundary.css';
import './styles/legal.css';

// Lazy load components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const RoleSelectPage = lazy(() => import('./pages/auth/RoleSelectPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const OAuthCallbackPage = lazy(() => import('./pages/auth/OAuthCallbackPage'));
const HomePage = lazy(() => import('./pages/patient/HomePage'));
const DoctorBrowsePage = lazy(() => import('./pages/patient/DoctorBrowsePage'));
const DoctorDetailPage = lazy(() => import('./pages/patient/DoctorDetailPage'));
const BookingPage = lazy(() => import('./pages/patient/BookingPage'));
const AppointmentsPage = lazy(() => import('./pages/patient/AppointmentsPage'));
const PatientProfilePage = lazy(() => import('./pages/patient/ProfilePage'));
const DoctorDashboardPage = lazy(() => import('./pages/doctor/DashboardPage'));
const DoctorAppointmentsPage = lazy(() => import('./pages/doctor/AppointmentsPage'));
const DoctorProfilePage = lazy(() => import('./pages/doctor/ProfilePage'));
const CompleteProfilePage = lazy(() => import('./pages/doctor/CompleteProfilePage'));
const EditProfilePage = lazy(() => import('./pages/shared/EditProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const DoctorApplicationsPage = lazy(() => import('./pages/admin/DoctorApplicationsPage'));
const DoctorReviewPage = lazy(() => import('./pages/admin/DoctorReviewPage'));
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  const isHydrated = useAuthStore(state => state.isHydrated);
  const hydrate = useAuthStore(state => state.hydrate);
  const isDarkMode = useUIStore(state => state.isDarkMode);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const initializeTheme = useUIStore.getState().initializeTheme;
    initializeTheme();
  }, []);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.includes('access_token=') || hash.includes('refresh_token=')) {
      const callbackUrl = `/auth/callback${hash}`;
      window.location.replace(callbackUrl);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const ProtectedRoute = ({ component: Component, requiredRole }) => {
    if (loading || !isHydrated) return <LoadingFallback />;
    if (!isAuthenticated) return <Navigate to="/auth/login" />;
    if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" />;
    return (
      <AppShell>
        <Component />
      </AppShell>
    );
  };

  const GuestRoute = ({ component: Component }) => {
    if (loading || !isHydrated) return <LoadingFallback />;
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
      if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
      return <Navigate to="/patient/home" replace />;
    }
    return <Component />;
  };

  // Intelligent root route redirection
  const RootRoute = () => {
    // Show loading while hydrating authentication state
    if (loading || !isHydrated) return <LoadingFallback />;

    if (isAuthenticated) {
      if (user?.role === 'doctor') {
        return <Navigate to="/doctor/dashboard" replace />;
      } else if (user?.role === 'patient') {
        return <Navigate to="/patient/home" replace />;
      } else if (user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
    }
    return <LandingPage />;
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Root Route - Intelligent Redirection */}
            <Route path="/" element={<RootRoute />} />
            
            {/* Marketing Routes (Secondary) */}
            <Route path="/about" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal/terms" element={<TermsOfServicePage />} />
            <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
            
            {/* Authentication Routes - Guest Only */}
            <Route path="/auth/role" element={<RoleSelectPage />} />
            <Route path="/auth/login" element={<GuestRoute component={LoginPage} />} />
            <Route path="/auth/signup" element={<GuestRoute component={SignupPage} />} />
            <Route path="/auth/callback" element={<OAuthCallbackPage />} />

            {/* Patient Routes */}
            <Route 
              path="/patient/home" 
              element={<ProtectedRoute component={HomePage} requiredRole="patient" />} 
            />
            <Route 
              path="/patient/doctors" 
              element={<ProtectedRoute component={DoctorBrowsePage} requiredRole="patient" />} 
            />
            <Route 
              path="/patient/doctors/:doctorId" 
              element={<ProtectedRoute component={DoctorDetailPage} requiredRole="patient" />} 
            />
            <Route 
              path="/patient/book/:doctorId" 
              element={<ProtectedRoute component={BookingPage} requiredRole="patient" />} 
            />
            <Route 
              path="/patient/appointments" 
              element={<ProtectedRoute component={AppointmentsPage} requiredRole="patient" />} 
            />
            <Route 
              path="/patient/profile" 
              element={<ProtectedRoute component={PatientProfilePage} requiredRole="patient" />} 
            />
            <Route 
              path="/patient/edit-profile" 
              element={<ProtectedRoute component={EditProfilePage} requiredRole="patient" />} 
            />

            {/* Doctor Routes */}
            <Route 
              path="/doctor/complete-profile" 
              element={<ProtectedRoute component={CompleteProfilePage} requiredRole="doctor" />} 
            />
            <Route 
              path="/doctor/dashboard" 
              element={<ProtectedRoute component={DoctorDashboardPage} requiredRole="doctor" />} 
            />
            <Route 
              path="/doctor/appointments" 
              element={<ProtectedRoute component={DoctorAppointmentsPage} requiredRole="doctor" />} 
            />
            <Route 
              path="/doctor/profile" 
              element={<ProtectedRoute component={DoctorProfilePage} requiredRole="doctor" />} 
            />
            <Route 
              path="/doctor/edit-profile" 
              element={<ProtectedRoute component={EditProfilePage} requiredRole="doctor" />} 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={<ProtectedRoute component={AdminDashboardPage} requiredRole="admin" />} 
            />
            <Route 
              path="/admin/doctors" 
              element={<ProtectedRoute component={DoctorApplicationsPage} requiredRole="admin" />} 
            />
            <Route 
              path="/admin/doctors/pending" 
              element={<ProtectedRoute component={DoctorApplicationsPage} requiredRole="admin" />} 
            />
            <Route 
              path="/admin/doctors/:doctorId" 
              element={<ProtectedRoute component={DoctorReviewPage} requiredRole="admin" />} 
            />
            <Route 
              path="/admin/profile" 
              element={<ProtectedRoute component={EditProfilePage} requiredRole="admin" />} 
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        <FloatingThemeToggle />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
