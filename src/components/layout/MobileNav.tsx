import { Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function MobileNav({ onNavigate, currentPage }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar 
          onClose={() => setIsOpen(false)} 
          onNavigate={onNavigate}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}