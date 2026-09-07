import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import NotificationWidget from '../widgets/NotificationWidget';
import { subscribeToRealtimeUpdates, REALTIME_REFRESH_EVENT } from '../../services/realtime';

export default function NotificationsFetcher() {
  const user = useAuthStore(state => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 60000);
    const unsubscribe = subscribeToRealtimeUpdates(user);
    const handleRefresh = () => fetchNotifications();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
    return () => {
      clearInterval(t);
      window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
      unsubscribe();
    };
  }, [user]);

  const unread = notifications.filter(n => !n.is_read);
  const latest = unread.length > 0 ? unread[0] : null;

  if (!latest) return null;

  const handleDismiss = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${latest.id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Optimistically remove
      setNotifications(prev => prev.map(n => n.id === latest.id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to dismiss notification', err);
    }
  };

  const handleAction = () => {
    // Primary action: refresh doctors list
    window.location.reload();
  };

  return (
    <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 1200 }}>
      <NotificationWidget
        title={latest.title}
        message={latest.message}
        type="info"
        onDismiss={handleDismiss}
        action="Refresh"
        onAction={handleAction}
      />
    </div>
  );
}
