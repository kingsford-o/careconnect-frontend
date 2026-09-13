import supabase from '../lib/supabaseClient';

/**
 * Real-time Notification Service
 * Handles all real-time communication between roles
 */

class NotificationService {
  constructor() {
    this.channels = [];
    this.listeners = new Map();
  }

  /**
   * Create a notification for a user
   */
  async createNotification(userId, notification) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type || 'info',
          metadata: notification.metadata || {},
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Notification created:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Notify admin when doctor completes profile
   */
  async notifyDoctorProfileCompletion(doctorId, doctorName) {
    // Get admin user
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .single();

    if (!adminUser) {
      console.warn('⚠️ No admin user found');
      return;
    }

    await this.createNotification(adminUser.id, {
      title: 'New Doctor Application',
      message: `Dr. ${doctorName} has completed their profile and is awaiting verification.`,
      type: 'doctor_verification',
      metadata: { doctorId, doctorName },
    });
  }

  /**
   * Notify doctor when profile is approved/rejected
   */
  async notifyDoctorProfileStatus(doctorId, status, reason = '') {
    // Get doctor user
    const { data: doctor } = await supabase
      .from('doctors')
      .select('user_id, full_name')
      .eq('id', doctorId)
      .single();

    if (!doctor) return;

    const title = status === 'approved' ? 'Profile Approved' : 'Profile Rejected';
    const message = status === 'approved'
      ? 'Your profile has been approved! You can now start accepting appointments.'
      : `Your profile was rejected: ${reason}`;

    await this.createNotification(doctor.user_id, {
      title,
      message,
      type: 'profile_status',
      metadata: { status, reason },
    });
  }

  /**
   * Notify patient when appointment is accepted/rejected
   */
  async notifyAppointmentStatus(appointmentId, patientId, status, doctorName) {
    const title = status === 'accepted' ? 'Appointment Accepted' : 'Appointment Rejected';
    const message = status === 'accepted'
      ? `Dr. ${doctorName} has accepted your appointment.`
      : `Dr. ${doctorName} has declined your appointment.`;

    await this.createNotification(patientId, {
      title,
      message,
      type: 'appointment_update',
      metadata: { appointmentId, doctorName, status },
    });
  }

  /**
   * Notify doctor of new appointment booking
   */
  async notifyNewAppointment(doctorId, patientName, appointmentId) {
    // Get doctor user
    const { data: doctor } = await supabase
      .from('doctors')
      .select('user_id')
      .eq('id', doctorId)
      .single();

    if (!doctor) return;

    await this.createNotification(doctor.user_id, {
      title: 'New Appointment Booking',
      message: `${patientName} has booked an appointment with you.`,
      type: 'new_appointment',
      metadata: { appointmentId, patientName },
    });
  }

  /**
   * Subscribe to real-time updates for a specific user
   */
  subscribeToUserNotifications(userId, callback) {
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    this.channels.push(channel);
    return channel;
  }

  /**
   * Subscribe to doctor status changes (for admin)
   */
  subscribeToDoctorStatusChanges(callback) {
    const channel = supabase
      .channel('doctor-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'doctors',
        },
        callback
      )
      .subscribe();

    this.channels.push(channel);
    return channel;
  }

  /**
   * Subscribe to appointment changes (for patients)
   */
  subscribeToPatientAppointments(patientId, callback) {
    const channel = supabase
      .channel(`patient-appointments-${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${patientId}`,
        },
        callback
      )
      .subscribe();

    this.channels.push(channel);
    return channel;
  }

  /**
   * Subscribe to verified doctors (for patients to see new doctors)
   */
  subscribeToVerifiedDoctors(callback) {
    const channel = supabase
      .channel('verified-doctors')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'doctors',
          filter: 'verification_status=eq.approved',
        },
        callback
      )
      .subscribe();

    this.channels.push(channel);
    return channel;
  }

  /**
   * Clean up all subscriptions
   */
  cleanup() {
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.channels = [];
    this.listeners.clear();
  }
}

// Singleton instance
export const notificationService = new NotificationService();
export default notificationService;