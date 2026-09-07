export const SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Dermatology',
  'General Practice',
  'Pediatrics',
  'Orthopedics',
  'Psychiatry',
  'Oncology',
  'Gynecology',
  'Ophthalmology',
];

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  RESCHEDULED: 'rescheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const CONSULTATION_TYPES = {
  TELEHEALTH: 'telehealth',
  IN_PERSON: 'in-person',
};

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
};

export const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const RATING_OPTIONS = [1, 2, 3, 4, 5];

export const API_ERRORS = {
  UNAUTHORIZED: 'Unauthorized access. Please login.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  SIGNUP_ROLE: 'signup_role',
  USER_DATA: 'user_data',
};
