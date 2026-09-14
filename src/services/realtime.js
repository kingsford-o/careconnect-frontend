import supabase from '../lib/supabaseClient';

const refreshEvent = 'careconnect:refresh';

export const subscribeToRealtimeUpdates = (user) => {
  if (!supabase || !user?.id) return () => {};

  const channels = [];
  const notifyRefresh = () => {
    window.dispatchEvent(new CustomEvent(refreshEvent));
  };

  try {
    // 1. Notifications Channel for current user
    const notificationsChannel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        notifyRefresh();
        window.dispatchEvent(new CustomEvent('notification', { detail: payload }));
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Realtime notifications channel unavailable; fallback active.');
        }
      });
    channels.push(notificationsChannel);

    // 2. Appointments Channel (Patient & Doctor real-time synchronization)
    const appointmentsChannel = supabase
      .channel(`appointments:${user.id}:${user.role}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
      }, (payload) => {
        notifyRefresh();
        window.dispatchEvent(new CustomEvent('appointment-change', { detail: payload }));
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Realtime appointments channel unavailable; fallback active.');
        }
      });
    channels.push(appointmentsChannel);

    // 3. Doctors & Verification Channel (Doctor & Admin synchronization)
    const doctorsChannel = supabase
      .channel(`doctors:${user.id}:${user.role}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctors',
      }, (payload) => {
        notifyRefresh();
        window.dispatchEvent(new CustomEvent('doctor-status-change', { detail: payload }));
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Realtime doctor channel unavailable; fallback active.');
        }
      });
    channels.push(doctorsChannel);
  } catch (err) {
    console.error('Error setting up Supabase realtime channels:', err);
  }

  // 4. Resilient background heartbeat (15s polling fallback)
  const pollInterval = setInterval(() => {
    notifyRefresh();
  }, 15000);

  return () => {
    clearInterval(pollInterval);
    channels.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // ignore cleanup error
      }
    });
  };
};

export const REALTIME_REFRESH_EVENT = refreshEvent;