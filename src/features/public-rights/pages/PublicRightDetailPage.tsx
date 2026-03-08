import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { he } from '@/i18n/he';
import { usePublicRight, useUpdatePublicRight } from '../hooks/usePublicRights';
import { PublicRightForm } from '../components/PublicRightForm';
import type { PublicRightFormData } from '../schemas/publicRightSchema';

const statusVariants = {
  available: 'success' as const,
  assigned_to_company_vehicle: 'info' as const,
  rented_to_private: 'warning' as const,
  frozen: 'danger' as const,
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'available':
      return he.publicRights.statusAvailable;
    case 'assigned_to_company_vehicle':
      return he.publicRights.statusAssignedToVehicle;
    case 'rented_to_private':
      return he.publicRights.statusRentedToPrivate;
    case 'frozen':
      return he.publicRights.statusFrozen;
    default:
      return status;
  }
};

export function PublicRightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: publicRight, isLoading, error } = usePublicRight(id!);
  const updatePublicRight = useUpdatePublicRight();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = (data: PublicRightFormData) => {
    if (!publicRight) return;
    const payload = {
      ...data,
      notes: data.notes || null,
    };

    updatePublicRight.mutate(
      { id: publicRight.id, data: payload },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('הזכות עודכנה בהצלחה');
        },
        onError: () => toast.error('שגיאה בעדכון הזכות'),
      },
    );
  };

  if (isLoading) return <LoadingState />;
  if (error || !publicRight) return <ErrorState message={error?.message ?? 'זכות לא נמצאה'} />;

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/public-rights')}>
          {he.common.back}
        </Button>
      </div>

      <PageHeader
        title={publicRight.right_number}
        actionLabel={he.common.edit}
        onAction={() => setIsFormOpen(true)}
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-100">
          <DetailRow label={he.publicRights.rightNumber} value={publicRight.right_number} />
          <div className="flex px-6 py-3">
            <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{he.common.status}</dt>
            <dd className="text-sm text-gray-900">
              <StatusBadge
                label={getStatusLabel(publicRight.status)}
                variant={statusVariants[publicRight.status as keyof typeof statusVariants]}
              />
            </dd>
          </div>
          <DetailRow label={he.common.notes} value={publicRight.notes} />
        </dl>
      </div>

      <PublicRightForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={updatePublicRight.isPending}
        publicRight={publicRight}
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
