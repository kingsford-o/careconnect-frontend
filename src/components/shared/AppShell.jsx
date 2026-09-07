import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import NotificationsFetcher from './NotificationsFetcher';

export default function AppShell({ children }) {
  const user = useAuthStore(state => state.user);
  const isSidebarClosed = useUIStore(state => state.isSidebarClosed);

  if (!user) return children;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className={`main-content-with-sidebar ${isSidebarClosed ? 'sidebar-closed' : ''}`}>
        {children}
      </main>
      <BottomNav />
      <NotificationsFetcher />
    </div>
  );
}
