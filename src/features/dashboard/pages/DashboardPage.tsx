import { he } from '@/i18n/he';

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{he.dashboard.title}</h1>
      <p className="mt-2 text-gray-600">{he.dashboard.welcome}</p>
    </div>
  );
}
