import { Command, Home, MessageSquare, Settings, X, History } from 'lucide-react';
import { NavLink } from './NavLink';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import { SettingsModal } from '../settings/SettingsModal';

interface SidebarProps {
  onClose?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Sidebar({ onClose, currentPage = 'dashboard', onNavigate }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNavigation = (page: string) => {
    onNavigate?.(page);
    if (onClose) onClose();
  };

  return (
    <>
      <aside className="fixed top-0 left-0 flex flex-col h-screen w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-neutral-800">
        {/* Header */}
        <div className="flex-shrink-0 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Command className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-none">Composer Kit</h2>
                <span className="text-sm text-gray-500 dark:text-neutral-400">AI Assistant</span>
              </div>
            </div>
            {onClose && (
              <button 
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <NavLink 
                onClick={() => handleNavigation('dashboard')}
                icon={<Home className="w-5 h-5" />} 
                active={currentPage === 'dashboard'}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                onClick={() => handleNavigation('chat')}
                icon={<MessageSquare className="w-5 h-5" />}
                active={currentPage === 'chat'}
              >
                Chat
              </NavLink>
            </li>
            <li>
              <NavLink 
                onClick={() => handleNavigation('history')}
                icon={<History className="w-5 h-5" />}
                active={currentPage === 'history'}
              >
                History
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <NavLink 
              onClick={() => setIsSettingsOpen(true)}
              icon={<Settings className="w-5 h-5" />}
            >
              Settings
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}