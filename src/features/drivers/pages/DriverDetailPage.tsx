import { useParams } from 'react-router-dom';
import { he } from '@/i18n/he';

export function DriverDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{he.drivers.title}</h1>
      <p className="mt-2 text-gray-500">placeholder — {id}</p>
    </div>
  );
}
