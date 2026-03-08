import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';

export function DriversListPage() {
  return (
    <div>
      <PageHeader title={he.drivers.title} actionLabel={he.drivers.addDriver} onAction={() => {}} />
    </div>
  );
}
