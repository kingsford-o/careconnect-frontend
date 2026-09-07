import { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';

export default function Modal({ children, onClose }) {
  const modal = useUIStore(state => state.modal);
  const hideModal = useUIStore(state => state.hideModal);

  const handleClose = () => {
    hideModal();
    if (onClose) onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    if (modal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modal, handleClose]);

  if (!modal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        {children}
      </div>
    </div>
  );
}
