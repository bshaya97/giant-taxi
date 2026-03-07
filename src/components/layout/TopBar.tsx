import { useAuth } from '@/hooks/useAuth';
import { he } from '@/i18n/he';

export function TopBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">{user.full_name}</span>
        )}
        <button
          onClick={signOut}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {he.common.logout}
        </button>
      </div>
    </header>
  );
}
