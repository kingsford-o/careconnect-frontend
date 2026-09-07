import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import Logo from '../brand/Logo';
import ConfirmDialog from '../common/ConfirmDialog';
import NotificationsPanel from '../common/NotificationsPanel';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const showModal = useUIStore(state => state.showModal);
  const isSidebarClosed = useUIStore(state => state.isSidebarClosed);
  const closeSidebar = useUIStore(state => state.closeSidebar);
  const openSidebar = useUIStore(state => state.openSidebar);

  if (!user) return null;

  const roleMeta = {
    patient: {
      portalName: 'Patient Portal',
      badgeClass: 'portal-badge-patient',
    },
    doctor: {
      portalName: 'Practitioner Hub',
      badgeClass: 'portal-badge-doctor',
    },
    admin: {
      portalName: 'Admin Console',
      badgeClass: 'portal-badge-admin',
    },
  }[user.role] || { portalName: 'CareConnect', badgeClass: '' };

  const patientNav = [
    { 
      path: '/patient/home', 
      label: 'Home', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      path: '/patient/doctors', 
      label: 'Doctors', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      )
    },
    { 
      path: '/patient/appointments', 
      label: 'Appointments', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    { 
      path: '/patient/profile', 
      label: 'Profile', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
  ];

  const doctorNav = [
    { 
      path: '/doctor/dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    { 
      path: '/doctor/appointments', 
      label: 'Appointments', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    { 
      path: '/doctor/profile', 
      label: 'Profile', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
  ];

  const adminNav = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    { 
      path: '/admin/doctors/pending', 
      label: 'Applications', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    { 
      path: '/admin/profile', 
      label: 'Profile', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
  ];

  const navItems = user.role === 'patient' ? patientNav : user.role === 'admin' ? adminNav : doctorNav;

  const handleLogout = () => {
    showModal(
      <ConfirmDialog
        title="Logout"
        message="Are you sure you want to end your current session?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => logout()}
        variant="danger"
      />
    );
  };

  const handleCloseSidebar = () => {
    closeSidebar();
  };

  return (
    <aside className={`sidebar-modern ${isSidebarClosed ? 'closed' : ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand-block">
          <div className="sidebar-logo-group" onClick={() => navigate('/')} role="button" tabIndex={0}>
            <Logo size={28} />
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">CareConnect</span>
              <span className={`sidebar-portal-tag ${roleMeta.badgeClass}`}>
                {roleMeta.portalName}
              </span>
            </div>
          </div>
          <div className="sidebar-header-actions">
            <NotificationsPanel />
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={handleCloseSidebar}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="sidebar-nav-list" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
            return (
              <button
                type="button"
                key={item.path}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
                {isActive && <span className="sidebar-active-indicator" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div
          className="sidebar-user-card"
          onClick={() => navigate(user.role === 'doctor' ? '/doctor/profile' : (user.role === 'admin' ? '/admin/profile' : '/patient/profile'))}
          role="button"
          tabIndex={0}
        >
          <div className="sidebar-user-avatar">
            {user.profile_image_url ? (
              <img src={user.profile_image_url} alt={user.full_name || 'User'} />
            ) : (
              <span className="user-initials">
                {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.full_name || 'User'}</span>
            <span className="sidebar-user-email">{user.email}</span>
          </div>
        </div>

        <div className="sidebar-footer-actions">
          <button
            type="button"
            className="sidebar-action-btn"
            onClick={() => navigate('/about')}
            aria-label="Help & Information"
            title="Help"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Help</span>
          </button>
          
          <button
            type="button"
            className="sidebar-action-btn logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

