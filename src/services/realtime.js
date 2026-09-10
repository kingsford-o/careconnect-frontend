import supabase from '../lib/supabaseClient';

const refreshEvent = 'careconnect:refresh';

export const subscribeToRealtimeUpdates = (user) => {
  if (!supabase || !user?.id) return () => {};

  const channels = [];
  const notifyRefresh = () => window.dispatchEvent(new CustomEvent(refreshEvent));

  const notificationsChannel = supabase
    .channel(`notifications:${user.id}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'notifications',
      filter: `user_id=eq.${user.id}`,
    }, notifyRefresh)
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn('Realtime notifications unavailable; using API polling fallback.');
      }
    });
  channels.push(notificationsChannel);

  if (user.role === 'doctor' || user.role === 'admin') {
    const doctorsChannel = supabase
      .channel(`doctors:${user.id}:${user.role}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'doctors',
        ...(user.role === 'doctor' ? { filter: `user_id=eq.${user.id}` } : {}),
      }, notifyRefresh)
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Realtime doctor updates unavailable; normal API fetching remains active.');
        }
      });
    channels.push(doctorsChannel);
  }

  return () => {
    channels.forEach(channel => supabase.removeChannel(channel));
  };
};

export const REALTIME_REFRESH_EVENT = refreshEvent;