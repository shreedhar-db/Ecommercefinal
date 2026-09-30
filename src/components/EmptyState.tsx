import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-border rounded-xl">
      <h2 className="text-xl font-semibold text-primary-black mb-2">{title}</h2>
      <p className="text-sm text-text-tertiary mb-6">{message}</p>
      {action}
    </div>
  );
}
