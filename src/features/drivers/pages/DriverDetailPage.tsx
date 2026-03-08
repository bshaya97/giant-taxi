import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { he } from '@/i18n/he';
import { useDriver, useUpdateDriver } from '../hooks/useDrivers';
import { DriverForm } from '../components/DriverForm';
import type { DriverFormData } from '../schemas/driverSchema';

export function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: driver, isLoading, error } = useDriver(id!);
  const updateDriver = useUpdateDriver();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = (data: DriverFormData) => {
    if (!driver) return;
    const payload = {
      ...data,
      phone: data.phone || null,
      email: data.email || null,
      license_number: data.license_number || null,
      license_expiry: data.license_expiry || null,
      notes: data.notes || null,
    };

    updateDriver.mutate(
      { id: driver.id, data: payload },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('הנהג עודכן בהצלחה');
        },
        onError: () => toast.error('שגיאה בעדכון הנהג'),
      },
    );
  };

  if (isLoading) return <LoadingState />;
  if (error || !driver) return <ErrorState message={error?.message ?? 'נהג לא נמצא'} />;

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/drivers')}>
          {he.common.back}
        </Button>
      </div>

      <PageHeader
        title={driver.full_name}
        actionLabel={he.common.edit}
        onAction={() => setIsFormOpen(true)}
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-100">
          <DetailRow label={he.drivers.fullName} value={driver.full_name} />
          <DetailRow label={he.drivers.idNumber} value={driver.id_number} />
          <DetailRow label={he.drivers.phone} value={driver.phone} />
          <DetailRow label={he.drivers.email} value={driver.email} />
          <DetailRow label={he.drivers.licenseNumber} value={driver.license_number} />
          <DetailRow label={he.drivers.licenseExpiry} value={driver.license_expiry} />
          <DetailRow
            label={he.drivers.engagementType}
            value={
              driver.engagement_type === 'licensed_dealer'
                ? he.drivers.licensedDealer
                : he.drivers.payroll
            }
          />
          <div className="flex px-6 py-3">
            <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{he.common.status}</dt>
            <dd className="text-sm text-gray-900">
              <StatusBadge
                label={driver.status === 'active' ? he.drivers.statusActive : he.drivers.statusInactive}
                variant={driver.status === 'active' ? 'success' : 'neutral'}
              />
            </dd>
          </div>
          <DetailRow label={he.common.notes} value={driver.notes} />
        </dl>
      </div>

      <DriverForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={updateDriver.isPending}
        driver={driver}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex px-6 py-3">
      <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{value || '—'}</dd>
    </div>
  );
}
