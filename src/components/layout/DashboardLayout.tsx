import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useNavigate } from '@/lib/navigate';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export function DashboardLayout({ children, currentPage = 'dashboard' }: DashboardLayoutProps) {
  const { navigate } = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentPage={currentPage} onNavigate={navigate} />
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
          {/* Mobile Navigation */}
          <div className="mb-6 md:hidden">
            <MobileNav currentPage={currentPage} onNavigate={navigate} />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}