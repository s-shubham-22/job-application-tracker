import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  KanbanSquare,
  List,
  Settings,
  BriefcaseBusiness,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/api/auth.api';
import { getInitials } from '@/utils/formatters';
import toast from 'react-hot-toast';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/kanban', label: 'Kanban Board', icon: KanbanSquare },
  { to: '/applications', label: 'Applications', icon: List },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isMobileOpen, onCloseMobile, isMinimized, onToggleMinimize }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
    toast.success('Logged out');
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <div 
        className={`sidebar-backdrop ${isMobileOpen ? 'visible' : ''}`} 
        onClick={onCloseMobile}
      />
      <aside 
        className={`sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isMinimized ? 'minimized' : ''}`}
      >
        {/* Header */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--color-brand-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <BriefcaseBusiness size={18} color="var(--color-brand-text)" />
            </div>
            <div className="sidebar-label">
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Job Tracker
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>App Manager</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onCloseMobile()}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer (User + Logout + Minimize) */}
        <div className="sidebar-footer">
          <div className="sidebar-user-details">
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {getInitials(user?.fullName)}
            </div>
            <div className="sidebar-label" style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'User'}
              </div>
            </div>
          </div>
          
          <div className="sidebar-actions-container" style={{ display: 'flex', gap: 8, flexDirection: isMinimized ? 'column' : 'row' }}>
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '8px' }}
              title="Logout"
            >
              <LogOut size={16} />
              <span className="sidebar-label">Logout</span>
            </button>
            <button
              onClick={onToggleMinimize}
              className="btn-secondary"
              style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}
              title="Minimize Sidebar"
            >
              {isMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
