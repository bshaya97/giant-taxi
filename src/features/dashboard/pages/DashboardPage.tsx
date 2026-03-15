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
import { Users, Car, BadgeCheck, CheckCircle, Link2, CreditCard } from 'lucide-react';

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
      <p className="mb-6 sm:mb-8 text-gray-600">{he.dashboard.welcome}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="כמות נהגים"
          value={totalDrivers ?? 0}
          isLoading={driversLoading}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="כמות רכבים"
          value={totalVehicles ?? 0}
          isLoading={vehiclesLoading}
          icon={Car}
          color="indigo"
        />
        <MetricCard
          title="כמות זכויות ציבוריות"
          value={totalPublicRights ?? 0}
          isLoading={publicRightsLoading}
          icon={BadgeCheck}
          color="violet"
        />
        <MetricCard
          title="זכויות ציבוריות זמינות"
          value={availablePublicRights ?? 0}
          isLoading={availableLoading}
          icon={CheckCircle}
          color="green"
          description="זמינות להשכרה"
        />
        <MetricCard
          title="רכבים משויכים לנהגים"
          value={assignedVehicles ?? 0}
          isLoading={assignedLoading}
          icon={Link2}
          color="amber"
          description="שיוכים פעילים"
        />
        <MetricCard
          title="חיובים פתוחים"
          value={openCharges ?? 0}
          isLoading={chargesLoading}
          icon={CreditCard}
          color="red"
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
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'indigo' | 'violet' | 'green' | 'amber' | 'red';
};

const colorConfigs = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-t-blue-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-t-indigo-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-t-violet-500' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-t-green-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-t-amber-500' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-t-red-500' },
};

function MetricCard({ title, value, isLoading, description, icon: Icon, color }: MetricCardProps) {
  const config = colorConfigs[color];

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm border-t-4 ${config.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {isLoading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          )}
          {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
        </div>
        <div className={`rounded-lg p-3 ${config.bg}`}>
          <Icon className={`h-6 w-6 ${config.text}`} />
        </div>
      </div>
    </div>
  );
}
