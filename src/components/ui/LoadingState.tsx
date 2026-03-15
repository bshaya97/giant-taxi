import { he } from '@/i18n/he';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = he.common.loading }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600" />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
}
