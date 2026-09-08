interface EmptyStateProps {
  message: string;
  description?: string;
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <p className="text-body font-bold text-sub">{message}</p>
      {description && <p className="text-caption text-sub mt-1">{description}</p>}
    </div>
  );
}
