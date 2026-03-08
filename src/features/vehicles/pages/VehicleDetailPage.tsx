import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { he } from '@/i18n/he';
import { useVehicle, useUpdateVehicle } from '../hooks/useVehicles';
import { VehicleForm } from '../components/VehicleForm';
import type { VehicleFormData } from '../schemas/vehicleSchema';

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useVehicle(id!);
  const updateVehicle = useUpdateVehicle();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = (data: VehicleFormData) => {
    if (!vehicle) return;
    const payload = {
      ...data,
      make: data.make || null,
      model: data.model || null,
      year: data.year ? Number(data.year) : null,
      color: data.color || null,
      vin: data.vin || null,
      notes: data.notes || null,
    };

    updateVehicle.mutate(
      { id: vehicle.id, data: payload },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('הרכב עודכן בהצלחה');
        },
        onError: () => toast.error('שגיאה בעדכון הרכב'),
      },
    );
  };

  if (isLoading) return <LoadingState />;
  if (error || !vehicle) return <ErrorState message={error?.message ?? 'רכב לא נמצא'} />;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'rented':
        return 'warning';
      case 'maintenance':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return he.vehicles.statusAvailable;
      case 'rented':
        return he.vehicles.statusRented;
      case 'maintenance':
        return he.vehicles.statusMaintenance;
      case 'inactive':
        return he.vehicles.statusInactive;
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/vehicles')}>
          {he.common.back}
        </Button>
      </div>

      <PageHeader
        title={vehicle.license_plate}
        actionLabel={he.common.edit}
        onAction={() => setIsFormOpen(true)}
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-100">
          <DetailRow label={he.vehicles.licensePlate} value={vehicle.license_plate} />
          <DetailRow label={he.vehicles.make} value={vehicle.make} />
          <DetailRow label={he.vehicles.model} value={vehicle.model} />
          <DetailRow label={he.vehicles.year} value={vehicle.year ? String(vehicle.year) : null} />
          <DetailRow label={he.vehicles.color} value={vehicle.color} />
          <DetailRow label={he.vehicles.vin} value={vehicle.vin} />
          <div className="flex px-6 py-3">
            <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{he.common.status}</dt>
            <dd className="text-sm text-gray-900">
              <StatusBadge
                label={getStatusLabel(vehicle.status)}
                variant={getStatusVariant(vehicle.status)}
              />
            </dd>
          </div>
          <DetailRow label={he.common.notes} value={vehicle.notes} />
        </dl>
      </div>

      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={updateVehicle.isPending}
        vehicle={vehicle}
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
