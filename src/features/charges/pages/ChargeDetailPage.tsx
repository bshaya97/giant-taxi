import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { he } from '@/i18n/he';

export function ChargeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/charges')}>
          {he.common.back}
        </Button>
      </div>
      <PageHeader title={he.charges.title} />
      <p className="text-gray-500">placeholder — {id}</p>
    </div>
  );
}
