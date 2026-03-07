import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { he } from '@/i18n/he';

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
          <h1 className="text-2xl font-bold text-gray-900">{he.appName}</h1>
          <p className="mt-2 text-gray-600">{he.login.title}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
