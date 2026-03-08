import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';

export function VehiclesListPage() {
  return (
    <div>
      <PageHeader title={he.vehicles.title} actionLabel={he.vehicles.addVehicle} onAction={() => {}} />
    </div>
  );
}
