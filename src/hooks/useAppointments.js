import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';

export const useAppointments = (userId, role) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentService.getByUser(userId, role);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && role) {
      fetchAppointments();
    }
  }, [userId, role]);

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await appointmentService.updateStatus(appointmentId, status);
      await fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'pending' || apt.status === 'confirmed'
  );

  const pastAppointments = appointments.filter(
    apt => apt.status === 'completed' || apt.status === 'cancelled' || apt.status === 'declined'
  );

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    updateAppointmentStatus,
    upcomingAppointments,
    pastAppointments,
  };
};
