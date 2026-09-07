export const dateUtils = {
  today: () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },

  tomorrow: () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  },

  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addWeeks: (date, weeks) => {
    const result = new Date(date);
    result.setDate(result.getDate() + (weeks * 7));
    return result;
  },

  isToday: (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  isFuture: (date) => {
    return date > new Date();
  },

  isPast: (date) => {
    return date < new Date();
  },

  getWeekStart: (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  getWeekEnd: (date = new Date()) => {
    const weekStart = dateUtils.getWeekStart(date);
    const weekEnd = dateUtils.addDays(weekStart, 6);
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd;
  },

  getMonthStart: (date = new Date()) => {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  getMonthEnd: (date = new Date()) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  formatForInput: (date) => {
    return date.toISOString().split('T')[0];
  },

  parseTime: (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  },

  isSameDay: (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  },

  daysBetween: (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
  },
};
