import { Inbox } from 'lucide-react';

type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Inbox className="mb-3 h-12 w-12 text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
