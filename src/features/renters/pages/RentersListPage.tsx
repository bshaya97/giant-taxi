import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';

export function RentersListPage() {
  return (
    <div>
      <PageHeader title={he.renters.title} actionLabel={he.renters.addRenter} onAction={() => {}} />
    </div>
  );
}
