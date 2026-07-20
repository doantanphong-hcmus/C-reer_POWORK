import { DashboardShell } from '@/components/layout';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
