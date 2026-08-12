'use client';

import { EmployerOverview } from '@/components/employer/EmployerOverview';
import { useAuth } from '@/lib/hooks/useAuth';

export default function EmployerDashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl space-y-4" aria-busy="true">
        <div className="h-20 animate-pulse rounded-xl bg-background-secondary" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-xl bg-background-secondary" />
          ))}
        </div>
      </div>
    );
  }

  return <EmployerOverview user={user} />;
}
