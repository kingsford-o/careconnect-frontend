import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import NotificationWidget from '../widgets/NotificationWidget';
import { subscribeToRealtimeUpdates, REALTIME_REFRESH_EVENT } from '../../services/realtime';
import supabase from '../../lib/supabaseClient';

export default function NotificationsFetcher() {
  const user = useAuthStore(state => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // NO STORAGE - Use Supabase client for direct database access
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Set up enhanced real-time subscriptions based on role
    const setupRealtimeSubscriptions = () => {
      const channels = [];

      // General notifications subscription
      const notificationsChannel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('🔔 Notification received:', payload);
            fetchNotifications();
            window.dispatchEvent(new CustomEvent('notification', { detail: payload }));
          }
        )
        .subscribe();
      channels.push(notificationsChannel);

      // Admin: Subscribe to doctor status changes
      if (user.role === 'admin') {
        const doctorsChannel = supabase
          .channel('doctors-status-admin')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'doctors',
            },
            (payload) => {
              console.log('👨‍⚕️ Doctor status changed:', payload);
              window.dispatchEvent(new CustomEvent('doctor-status-change', { detail: payload }));
              fetchNotifications(); // Refresh notifications as admin might need to see new applications
            }
          )
          .subscribe();
        channels.push(doctorsChannel);
      }

      // Patient: Subscribe to appointment changes
      if (user.role === 'patient') {
        const appointmentsChannel = supabase
          .channel(`patient-appointments-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'appointments',
              filter: `patient_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('📅 Patient appointment changed:', payload);
              window.dispatchEvent(new CustomEvent('appointment-change', { detail: payload }));
              fetchNotifications();
            }
          )
          .subscribe();
        channels.push(appointmentsChannel);

        // Also subscribe to doctor profile changes to see newly verified doctors
        const doctorsChannel = supabase
          .channel('verified-doctors-patient')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'doctors',
              filter: 'verification_status=eq.approved',
            },
            (payload) => {
              console.log('✅ New verified doctor:', payload);
              window.dispatchEvent(new CustomEvent('new-verified-doctor', { detail: payload }));
            }
          )
          .subscribe();
        channels.push(doctorsChannel);
      }

      // Doctor: Subscribe to appointment changes
      if (user.role === 'doctor') {
        const doctorAppointmentsChannel = supabase
          .channel(`doctor-appointments-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'appointments',
              filter: `doctor_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('📅 Doctor appointment changed:', payload);
              window.dispatchEvent(new CustomEvent('appointment-change', { detail: payload }));
              fetchNotifications();
            }
          )
          .subscribe();
        channels.push(doctorAppointmentsChannel);

        // Subscribe to own profile verification status changes
        const profileChannel = supabase
          .channel(`doctor-profile-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'doctors',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('👨‍⚕️ Doctor profile status changed:', payload);
              window.dispatchEvent(new CustomEvent('profile-status-change', { detail: payload }));
              fetchNotifications();
            }
          )
          .subscribe();
        channels.push(profileChannel);
      }

      return channels;
    };

    const channels = setupRealtimeSubscriptions();

    // Legacy subscription support
    const unsubscribe = subscribeToRealtimeUpdates(user);
    const handleRefresh = () => fetchNotifications();
    window.addEventListener(REALTIME_REFRESH_EVENT, handleRefresh);

    return () => {
      // Clean up all Supabase channels
      channels.forEach(channel => supabase.removeChannel(channel));
      window.removeEventListener(REALTIME_REFRESH_EVENT, handleRefresh);
      unsubscribe();
    };
  }, [user]);

  const unread = notifications.filter(n => !n.is_read);
  const latest = unread.length > 0 ? unread[0] : null;

  if (!latest) return null;

  const handleDismiss = async () => {
    try {
      // NO STORAGE - Use Supabase directly
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', latest.id);

      if (error) throw error;

      // Optimistically remove
      setNotifications(prev => prev.map(n => n.id === latest.id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to dismiss notification', err);
    }
  };

  const handleAction = () => {
    // Smart action based on notification type
    if (latest.type === 'doctor_verification') {
      window.location.href = '/admin/doctors/pending';
    } else if (latest.type === 'appointment_update') {
      window.location.href = user.role === 'doctor' ? '/doctor/appointments' : '/patient/appointments';
    } else if (latest.type === 'profile_approved') {
      window.location.href = '/doctor/dashboard';
    } else {
      window.location.reload();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 1200 }}>
      <NotificationWidget
        title={latest.title}
        message={latest.message}
        type="info"
        onDismiss={handleDismiss}
        action="View Details"
        onAction={handleAction}
      />
    </div>
  );
}
