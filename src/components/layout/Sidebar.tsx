import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { he } from '@/i18n/he';
import { LayoutDashboard, Users, Car, BadgeCheck, UserCheck, CreditCard, Settings } from 'lucide-react';

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { to: ROUTES.dashboard, label: he.nav.dashboard, icon: LayoutDashboard },
  { to: ROUTES.drivers, label: he.nav.drivers, icon: Users },
  { to: ROUTES.vehicles, label: he.nav.vehicles, icon: Car },
  { to: ROUTES.publicRights, label: he.nav.publicRights, icon: BadgeCheck },
  { to: ROUTES.renters, label: he.nav.renters, icon: UserCheck },
  { to: ROUTES.charges, label: he.nav.charges, icon: CreditCard },
  { to: ROUTES.users, label: he.nav.users, icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const { isAdmin } = useAuth();

  const mainItems = navItems.filter((item) => !item.adminOnly);
  const adminItems = navItems.filter((item) => item.adminOnly);

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-white">
      <div className="flex h-14 items-center justify-center border-b border-white/10 gap-2">
        <Car className="h-5 w-5" />
        <h1 className="text-lg font-bold">{he.appName}</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {mainItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => {
                  return `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'border-l-2 border-primary-400 bg-sidebar-active font-medium'
                      : 'hover:bg-sidebar-hover'
                  }`;
                }}
              >
                {() => {
                  const Icon = item.icon;
                  return (
                    <>
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </>
                  );
                }}
              </NavLink>
            </li>
          ))}
        </ul>

        {isAdmin && adminItems.length > 0 && (
          <>
            <div className="my-3 border-t border-white/10" />
            <ul className="space-y-1 px-3">
              {adminItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'border-l-2 border-primary-400 bg-sidebar-active font-medium'
                          : 'hover:bg-sidebar-hover'
                      }`
                    }
                  >
                    {() => {
                      const Icon = item.icon;
                      return (
                        <>
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </>
                      );
                    }}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
}
