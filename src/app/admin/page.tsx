import { AdminLayout } from '@/components/layout/admin-layout'
import { DashboardOverview } from '@/components/features/dashboard-overview'

export default function AdminPage() {
  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  )
}

export const metadata = {
  title: 'Admin Dashboard - Termin App',
  description: 'Verwaltung von Terminen, Buchungen und Nutzern',
}
