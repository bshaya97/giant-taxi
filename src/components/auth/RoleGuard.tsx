import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

type RoleGuardProps = {
  requiredRole: UserRole;
};

export function RoleGuard({ requiredRole }: RoleGuardProps) {
  const { user } = useAuth();

  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
