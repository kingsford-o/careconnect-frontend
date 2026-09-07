import { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';

export default function Toast() {
  const toast = useUIStore(state => state.toast);
  const hideToast = useUIStore(state => state.hideToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const typeClasses = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info',
    warning: 'toast-warning',
  };

  return (
    <div className={`toast ${typeClasses[toast.type]}`}>
      {toast.message}
    </div>
  );
}
