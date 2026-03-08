import { PageHeader } from '@/components/ui/PageHeader';
import { he } from '@/i18n/he';
import {
  useTotalDrivers,
  useTotalVehicles,
  useTotalPublicRights,
  useAvailablePublicRights,
  useAssignedVehicles,
  useOpenCharges,
} from '../hooks/useDashboardMetrics';

export function DashboardPage() {
  const { data: totalDrivers, isLoading: driversLoading } = useTotalDrivers();
  const { data: totalVehicles, isLoading: vehiclesLoading } = useTotalVehicles();
  const { data: totalPublicRights, isLoading: publicRightsLoading } = useTotalPublicRights();
  const { data: availablePublicRights, isLoading: availableLoading } =
    useAvailablePublicRights();
  const { data: assignedVehicles, isLoading: assignedLoading } = useAssignedVehicles();
  const { data: openCharges, isLoading: chargesLoading } = useOpenCharges();

  return (
    <div>
      <PageHeader title={he.dashboard.title} />
      <p className="mb-8 text-gray-600">{he.dashboard.welcome}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="כמות נהגים"
          value={totalDrivers ?? 0}
          isLoading={driversLoading}
        />
        <MetricCard
          title="כמות רכבים"
          value={totalVehicles ?? 0}
          isLoading={vehiclesLoading}
        />
        <MetricCard
          title="כמות זכויות ציבוריות"
          value={totalPublicRights ?? 0}
          isLoading={publicRightsLoading}
        />
        <MetricCard
          title="זכויות ציבוריות זמינות"
          value={availablePublicRights ?? 0}
          isLoading={availableLoading}
          description="זמינות להשכרה"
        />
        <MetricCard
          title="רכבים משויכים לנהגים"
          value={assignedVehicles ?? 0}
          isLoading={assignedLoading}
          description="שיוכים פעילים"
        />
        <MetricCard
          title="חיובים פתוחים"
          value={openCharges ?? 0}
          isLoading={chargesLoading}
          description="ממתינים לתשלום"
        />
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: number;
  isLoading: boolean;
  description?: string;
};

function MetricCard({ title, value, isLoading, description }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      {isLoading ? (
        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      )}
      {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
    </div>
  );
}
