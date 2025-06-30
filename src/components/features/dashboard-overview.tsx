'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  MapPin,
  Plus,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react'

// This would come from your API/database
interface DashboardData {
  stats: {
    totalAppointments: number
    totalBookings: number
    totalUsers: number
    todayAppointments: number
    todayBookings: number
    utilizationRate: number
    trends: {
      appointments: number
      bookings: number
      users: number
      utilization: number
    }
  }
  todayAppointments: Array<{
    id: string
    type: 'PICKUP' | 'VIEWING'
    title: string
    time: string
    location: string
    booked: number
    capacity: number
    status: 'active' | 'full' | 'cancelled'
    auctionNumber: string
  }>
  recentActivity: Array<{
    id: string
    action: string
    user: string
    appointment: string
    time: string
    type: 'booking' | 'appointment' | 'cancellation' | 'login'
  }>
  upcomingAppointments: Array<{
    id: string
    type: 'PICKUP' | 'VIEWING'
    title: string
    date: string
    time: string
    location: string
    booked: number
    capacity: number
    status: 'active' | 'full' | 'cancelled'
    auctionNumber: string
  }>
}

// Mock data - in real app this would come from API
const mockDashboardData: DashboardData = {
  stats: {
    totalAppointments: 24,
    totalBookings: 187,
    totalUsers: 342,
    todayAppointments: 5,
    todayBookings: 12,
    utilizationRate: 78.5,
    trends: {
      appointments: 12, // +12%
      bookings: 8, // +8%
      users: 3, // +3%
      utilization: 5, // +5%
    },
  },
  todayAppointments: [
    {
      id: '1',
      type: 'VIEWING',
      title: 'Kunstauktion - Besichtigung',
      time: '10:00 - 16:00',
      location: 'Hamburg',
      booked: 18,
      capacity: 30,
      status: 'active',
      auctionNumber: 'A-2025-001',
    },
    {
      id: '2',
      type: 'PICKUP',
      title: 'Fahrzeuge - Abholung',
      time: '09:00 - 12:00',
      location: 'München',
      booked: 20,
      capacity: 20,
      status: 'full',
      auctionNumber: 'A-2024-087',
    },
    {
      id: '3',
      type: 'VIEWING',
      title: 'Schmuck & Uhren',
      time: '14:00 - 18:00',
      location: 'Berlin',
      booked: 8,
      capacity: 25,
      status: 'active',
      auctionNumber: 'A-2025-003',
    },
  ],
  recentActivity: [
    {
      id: '1',
      action: 'Neue Buchung',
      user: 'Max Mustermann',
      appointment: 'Kunstauktion - Besichtigung',
      time: 'vor 2 Min.',
      type: 'booking',
    },
    {
      id: '2',
      action: 'Termin erstellt',
      user: 'Admin',
      appointment: 'Möbelauktion - Abholung',
      time: 'vor 15 Min.',
      type: 'appointment',
    },
    {
      id: '3',
      action: 'Buchung storniert',
      user: 'Anna Schmidt',
      appointment: 'Fahrzeuge - Abholung',
      time: 'vor 32 Min.',
      type: 'cancellation',
    },
    {
      id: '4',
      action: 'Admin-Login',
      user: 'System Administrator',
      appointment: 'Dashboard-Zugriff',
      time: 'vor 1 Std.',
      type: 'login',
    },
  ],
  upcomingAppointments: [
    {
      id: '4',
      type: 'VIEWING',
      title: 'Antiquitäten - Besichtigung',
      date: 'Morgen',
      time: '09:00 - 17:00',
      location: 'Frankfurt',
      booked: 12,
      capacity: 40,
      status: 'active',
      auctionNumber: 'A-2025-004',
    },
    {
      id: '5',
      type: 'PICKUP',
      title: 'Elektronik - Abholung',
      date: '3. Juli',
      time: '10:00 - 14:00',
      location: 'Köln',
      booked: 8,
      capacity: 15,
      status: 'active',
      auctionNumber: 'A-2025-005',
    },
    {
      id: '6',
      type: 'VIEWING',
      title: 'Immobilien - Besichtigung',
      date: '5. Juli',
      time: '11:00 - 15:00',
      location: 'Stuttgart',
      booked: 0,
      capacity: 20,
      status: 'active',
      auctionNumber: 'A-2025-006',
    },
  ],
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  loading = false,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  description?: string
  loading?: boolean
}) {
  const isPositive = trend ? trend > 0 : false
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="mt-1 flex items-center text-xs">
            <TrendIcon
              className={`mr-1 h-3 w-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
            />
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {isPositive ? '+' : ''}
              {trend}%
            </span>
            <span className="text-muted-foreground ml-1">
              seit letztem Monat
            </span>
          </div>
        )}
        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// Appointment Status Badge
function AppointmentStatusBadge({
  status,
  booked,
  capacity,
}: {
  status: string
  booked: number
  capacity: number
}) {
  const percentage = (booked / capacity) * 100

  if (status === 'cancelled') {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Abgesagt
      </Badge>
    )
  }

  if (status === 'full' || percentage === 100) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Ausgebucht
      </Badge>
    )
  }

  if (percentage >= 80) {
    return (
      <Badge
        variant="default"
        className="flex items-center gap-1 bg-orange-500"
      >
        <Timer className="h-3 w-3" />
        Fast voll
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Verfügbar
    </Badge>
  )
}

// Activity Type Icon
function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'booking':
      return <BookOpen className="h-4 w-4 text-green-600" />
    case 'appointment':
      return <Calendar className="h-4 w-4 text-blue-600" />
    case 'cancellation':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case 'login':
      return <Activity className="h-4 w-4 text-purple-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

// Appointment Type Badge
function AppointmentTypeBadge({ type }: { type: 'PICKUP' | 'VIEWING' }) {
  return (
    <Badge
      variant="outline"
      className={
        type === 'VIEWING'
          ? 'border-blue-200 text-blue-700'
          : 'border-green-200 text-green-700'
      }
    >
      {type === 'VIEWING' ? 'Besichtigung' : 'Abholung'}
    </Badge>
  )
}

// Main Dashboard Component
export function DashboardOverview() {
  const [isLoading, setIsLoading] = React.useState(false)
  const data = mockDashboardData // In real app: useSWR or similar

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Übersicht über Termine, Buchungen und Aktivitäten •{' '}
            {new Date().toLocaleDateString('de-DE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            Exportieren
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Termin
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Aktive Termine"
          value={data.stats.totalAppointments}
          icon={Calendar}
          trend={data.stats.trends.appointments}
          description={`Heute: ${data.stats.todayAppointments} Termine`}
          loading={isLoading}
        />
        <StatsCard
          title="Gesamte Buchungen"
          value={data.stats.totalBookings}
          icon={BookOpen}
          trend={data.stats.trends.bookings}
          description={`Heute: ${data.stats.todayBookings} neue`}
          loading={isLoading}
        />
        <StatsCard
          title="Registrierte Nutzer"
          value={data.stats.totalUsers}
          icon={Users}
          trend={data.stats.trends.users}
          description="Aktive Accounts"
          loading={isLoading}
        />
        <StatsCard
          title="Auslastung"
          value={`${data.stats.utilizationRate}%`}
          icon={TrendingUp}
          trend={data.stats.trends.utilization}
          description="Durchschnittlich"
          loading={isLoading}
        />
      </div>

      {/* Today's Appointments and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Heutige Termine
              <Badge variant="secondary">{data.todayAppointments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="hover:bg-muted/50 flex items-center justify-between space-x-4 rounded-lg border p-4 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AppointmentTypeBadge type={appointment.type} />
                      <AppointmentStatusBadge
                        status={appointment.status}
                        booked={appointment.booked}
                        capacity={appointment.capacity}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {appointment.auctionNumber}
                      </p>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {appointment.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-sm font-medium">
                      {appointment.booked}/{appointment.capacity}
                    </div>
                    <div className="bg-muted h-2 w-full max-w-[60px] rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(appointment.booked / appointment.capacity) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Letzte Aktivitäten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="hover:bg-muted/50 flex items-start space-x-3 rounded-lg p-2 transition-colors"
                >
                  <ActivityIcon type={activity.type} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium">{activity.user}</span> •{' '}
                      {activity.appointment}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs whitespace-nowrap">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Kommende Termine</span>
            <Button variant="outline" size="sm">
              Alle anzeigen
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Termin</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Ort</TableHead>
                <TableHead>Buchungen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.upcomingAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.title}</div>
                      <div className="text-muted-foreground text-sm">
                        {appointment.auctionNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <AppointmentTypeBadge type={appointment.type} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.date}</div>
                      <div className="text-muted-foreground text-sm">
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {appointment.booked}/{appointment.capacity}
                      </span>
                      <div className="bg-muted h-2 w-12 rounded-full">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(appointment.booked / appointment.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <AppointmentStatusBadge
                      status={appointment.status}
                      booked={appointment.booked}
                      capacity={appointment.capacity}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverview
