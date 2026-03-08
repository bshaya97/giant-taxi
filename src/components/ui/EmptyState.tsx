type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
