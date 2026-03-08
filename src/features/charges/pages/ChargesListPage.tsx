import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';

export function ChargesListPage() {
  return (
    <div>
      <PageHeader title={he.charges.title} actionLabel={he.charges.addCharge} onAction={() => {}} />
    </div>
  );
}
