import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { he } from '@/i18n/he';
import { Car } from 'lucide-react';

export function LoginPage() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">{he.common.loading}</p>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 flex justify-center">
            <Car className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{he.appName}</h1>
          <p className="mt-2 text-gray-600">{he.login.title}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
