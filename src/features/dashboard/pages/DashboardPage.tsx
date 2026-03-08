import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';

export function DashboardPage() {
  return (
    <div>
      <PageHeader title={he.dashboard.title} />
      <p className="text-gray-600">{he.dashboard.welcome}</p>
    </div>
  );
}
