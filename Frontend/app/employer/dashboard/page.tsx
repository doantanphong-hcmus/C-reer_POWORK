'use client';

import { EmployerOverview } from '@/components/employer/EmployerOverview';
import { useAuth } from '@/lib/hooks/useAuth';

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  return user ? <EmployerOverview user={user} /> : null;
}
