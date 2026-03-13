import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { DriversListPage } from '@/features/drivers/pages/DriversListPage';
import { DriverDetailPage } from '@/features/drivers/pages/DriverDetailPage';
import { VehiclesListPage } from '@/features/vehicles/pages/VehiclesListPage';
import { VehicleDetailPage } from '@/features/vehicles/pages/VehicleDetailPage';
import { PublicRightsListPage } from '@/features/public-rights/pages/PublicRightsListPage';
import { PublicRightDetailPage } from '@/features/public-rights/pages/PublicRightDetailPage';
import { RentersListPage } from '@/features/renters/pages/RentersListPage';
import { RenterDetailPage } from '@/features/renters/pages/RenterDetailPage';
import { ChargesListPage } from '@/features/charges/pages/ChargesListPage';
import { ChargeDetailPage } from '@/features/charges/pages/ChargeDetailPage';
import { UsersListPage } from '@/features/users/pages/UsersListPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/drivers" element={<DriversListPage />} />
                <Route path="/drivers/:id" element={<DriverDetailPage />} />
                <Route path="/vehicles" element={<VehiclesListPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                <Route path="/public-rights" element={<PublicRightsListPage />} />
                <Route path="/public-rights/:id" element={<PublicRightDetailPage />} />
                <Route path="/renters" element={<RentersListPage />} />
                <Route path="/renters/:id" element={<RenterDetailPage />} />
                <Route path="/charges" element={<ChargesListPage />} />
                <Route path="/charges/:id" element={<ChargeDetailPage />} />

                <Route element={<RoleGuard requiredRole="admin" />}>
                  <Route path="/users" element={<UsersListPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
