import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Dashboard - SignPubliQ',
  description: 'Manage documents, envelopes and account settings',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <DashboardClient username="Jane Admin" />
    </div>
  );
}
