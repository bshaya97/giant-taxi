import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';

export function PublicRightsListPage() {
  return (
    <div>
      <PageHeader title={he.publicRights.title} actionLabel={he.publicRights.addRight} onAction={() => {}} />
    </div>
  );
}
