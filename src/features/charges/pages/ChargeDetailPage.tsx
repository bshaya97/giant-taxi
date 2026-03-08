import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { he } from '@/i18n/he';
import { useCharge, useUpdateCharge } from '../hooks/useCharges';
import { ChargeForm } from '../components/ChargeForm';
import type { ChargeFormData } from '../schemas/chargeSchema';

const statusVariants = {
  draft: 'neutral' as const,
  open: 'info' as const,
  paid: 'success' as const,
  cancelled: 'danger' as const,
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'draft':
      return he.charges.statusDraft;
    case 'open':
      return he.charges.statusOpen;
    case 'paid':
      return he.charges.statusPaid;
    case 'cancelled':
      return he.charges.statusCancelled;
    default:
      return status;
  }
};

const getChargeTypeLabel = (type: string): string => {
  switch (type) {
    case 'vehicle_rental':
      return he.charges.vehicleRental;
    case 'public_right_rental':
      return he.charges.publicRightRental;
    default:
      return type;
  }
};

export function ChargeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: charge, isLoading, error } = useCharge(id!);
  const updateCharge = useUpdateCharge();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = (data: ChargeFormData) => {
    if (!charge) return;
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
      description: data.description || null,
      period_start: data.period_start || null,
      period_end: data.period_end || null,
      driver_id: data.driver_id || null,
      vehicle_id: data.vehicle_id || null,
      renter_id: data.renter_id || null,
      public_right_id: data.public_right_id || null,
      notes: data.notes || null,
    };

    updateCharge.mutate(
      { id: charge.id, data: payload },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('החיוב עודכן בהצלחה');
        },
        onError: () => toast.error('שגיאה בעדכון החיוב'),
      },
    );
  };

  if (isLoading) return <LoadingState />;
  if (error || !charge) return <ErrorState message={error?.message ?? 'חיוב לא נמצא'} />;

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/charges')}>
          {he.common.back}
        </Button>
      </div>

      <PageHeader
        title={`${getChargeTypeLabel(charge.charge_type)} - ${charge.amount} ${charge.currency}`}
        actionLabel={he.common.edit}
        onAction={() => setIsFormOpen(true)}
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-100">
          <DetailRow label={he.charges.chargeType} value={getChargeTypeLabel(charge.charge_type)} />
          <DetailRow label={he.charges.amount} value={`${charge.amount} ${charge.currency}`} />
          <div className="flex px-6 py-3">
            <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{he.common.status}</dt>
            <dd className="text-sm text-gray-900">
              <StatusBadge
                label={getStatusLabel(charge.charge_status)}
                variant={statusVariants[charge.charge_status as keyof typeof statusVariants]}
              />
            </dd>
          </div>
          <DetailRow label="תיאור" value={charge.description} />
          <DetailRow label="תאריך התחלה" value={charge.period_start} />
          <DetailRow label="תאריך סיום" value={charge.period_end} />
          <DetailRow label={he.common.notes} value={charge.notes} />
        </dl>
      </div>

      <ChargeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={updateCharge.isPending}
        charge={charge}
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
