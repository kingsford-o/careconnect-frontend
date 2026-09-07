import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function NotificationsPanel() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const handleRefresh = () => fetchNotifications();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    for (const notif of unread) {
      markAsRead(notif.id);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    setIsOpen(false);

    // Route based on notification context
    if (notif.data?.appointmentId) {
      if (user?.role === 'doctor') {
        navigate('/doctor/appointments');
      } else {
        navigate('/patient/appointments');
      }
    } else if (notif.data?.doctorId && user?.role === 'admin') {
      navigate(`/admin/doctors/${notif.data.doctorId}`);
    } else if (user?.role === 'patient' && notif.type === 'doctor_approved_discovery') {
      navigate('/patient/doctors');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notifications-panel-wrapper" ref={panelRef}>
      <button
        type="button"
        className={`notifications-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        title="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notifications-counter-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-popover" role="dialog" aria-label="Notifications panel">
          <div className="notifications-popover-header">
            <div className="notifications-title-row">
              <h4>Notifications</h4>
              {unreadCount > 0 && (
                <span className="notifications-unread-pill">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="mark-all-read-btn"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notifications-popover-body">
            {loading ? (
              <div className="notifications-loading-state">
                <div className="loading-spinner-sm"></div>
                <span>Checking updates...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notifications-empty-state">
                <div className="empty-bell-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <p>No notifications yet</p>
                <small>Updates on appointments and verifications will show here</small>
              </div>
            ) : (
              <div className="notifications-scroll-list">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-card-item ${!notif.is_read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="notification-type-indicator">
                      <span className={`type-dot ${notif.type || 'info'}`}></span>
                    </div>
                    <div className="notification-details">
                      <div className="notification-item-title">{notif.title || 'System Notification'}</div>
                      <p className="notification-item-message">{notif.message}</p>
                      <span className="notification-item-timestamp">
                        {new Date(notif.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {!notif.is_read && (
                      <span className="unread-dot" title="Unread"></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

