import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, Sun, Moon } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopMinimized, setIsDesktopMinimized] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isMinimized={isDesktopMinimized}
        onToggleMinimize={() => setIsDesktopMinimized(!isDesktopMinimized)}
      />
      <main className={`page-wrapper ${isDesktopMinimized ? 'sidebar-minimized' : ''}`}>
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="btn-secondary mobile-menu-btn" 
              style={{ padding: '6px' }}
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Overview</span>
          </div>
          <div>
            <button 
              className="btn-secondary"
              style={{ padding: '6px', borderRadius: '50%' }}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
