import { useParams } from 'react-router-dom';
import { he } from '@/i18n/he';

export function ChargeDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{he.charges.title}</h1>
      <p className="mt-2 text-gray-500">placeholder — {id}</p>
    </div>
  );
}
