import { useAuth } from '@/hooks/useAuth';
import { he } from '@/i18n/he';
import { useLocation } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';

const pathToTitle: Record<string, string> = {
  '/': he.nav.dashboard,
  '/drivers': he.nav.drivers,
  '/vehicles': he.nav.vehicles,
  '/public-rights': he.nav.publicRights,
  '/renters': he.nav.renters,
  '/charges': he.nav.charges,
  '/users': he.nav.users,
};

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const currentTitle = pathToTitle[location.pathname] || he.nav.dashboard;
  const userInitials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
          title={he.common.menu}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-sm font-semibold text-gray-800 truncate">{currentTitle}</div>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
              {userInitials}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{user.full_name}</span>
          </div>
        )}
        <button
          onClick={signOut}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
          title={he.common.logout}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
