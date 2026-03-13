import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { he } from '@/i18n/he';

type NavItem = {
  to: string;
  label: string;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { to: ROUTES.dashboard, label: he.nav.dashboard },
  { to: ROUTES.drivers, label: he.nav.drivers },
  { to: ROUTES.vehicles, label: he.nav.vehicles },
  { to: ROUTES.publicRights, label: he.nav.publicRights },
  { to: ROUTES.renters, label: he.nav.renters },
  { to: ROUTES.charges, label: he.nav.charges },
  { to: ROUTES.users, label: he.nav.users, adminOnly: true },
];

export function Sidebar() {
  const { isAdmin } = useAuth();

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="flex h-screen w-56 flex-col bg-sidebar text-white">
      <div className="flex h-14 items-center justify-center border-b border-white/10">
        <h1 className="text-lg font-bold">{he.appName}</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-sidebar-active font-medium'
                      : 'hover:bg-sidebar-hover'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
