import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';

export function UsersListPage() {
  return (
    <div>
      <PageHeader title={he.users.title} />
    </div>
  );
}
