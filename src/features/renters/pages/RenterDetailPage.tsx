import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { he } from '@/i18n/he';
import { useRenter, useUpdateRenter } from '../hooks/useRenters';
import { RenterForm } from '../components/RenterForm';
import type { RenterFormData } from '../schemas/renterSchema';

export function RenterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: renter, isLoading, error } = useRenter(id!);
  const updateRenter = useUpdateRenter();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = (data: RenterFormData) => {
    if (!renter) return;
    const payload = {
      ...data,
      phone: data.phone || null,
      email: data.email || null,
      company_name: data.company_name || null,
      notes: data.notes || null,
    };

    updateRenter.mutate(
      { id: renter.id, data: payload },
      {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success('השוכר עודכן בהצלחה');
        },
        onError: () => toast.error('שגיאה בעדכון השוכר'),
      },
    );
  };

  if (isLoading) return <LoadingState />;
  if (error || !renter) return <ErrorState message={error?.message ?? 'שוכר לא נמצא'} />;

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/renters')}>
          {he.common.back}
        </Button>
      </div>

      <PageHeader
        title={renter.full_name}
        actionLabel={he.common.edit}
        onAction={() => setIsFormOpen(true)}
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-100">
          <DetailRow label={he.renters.fullName} value={renter.full_name} />
          <DetailRow label={he.renters.idNumber} value={renter.id_number} />
          <DetailRow label={he.renters.phone} value={renter.phone} />
          <DetailRow label={he.renters.email} value={renter.email} />
          <DetailRow label={he.renters.companyName} value={renter.company_name} />
          <div className="flex px-6 py-3">
            <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{he.common.status}</dt>
            <dd className="text-sm text-gray-900">
              <StatusBadge
                label={renter.status === 'active' ? he.renters.statusActive : he.renters.statusInactive}
                variant={renter.status === 'active' ? 'success' : 'neutral'}
              />
            </dd>
          </div>
          <DetailRow label={he.common.notes} value={renter.notes} />
        </dl>
      </div>

      <RenterForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={updateRenter.isPending}
        renter={renter}
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
