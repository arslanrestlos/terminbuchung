'use client'

import React, { useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Copy,
  MapPin,
  Clock,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  Timer,
} from 'lucide-react'

// Mock data for appointments
const mockAppointments = [
  {
    id: '1',
    type: 'VIEWING',
    auctionNumber: 'A-2025-001',
    title: 'Kunstauktion - Besichtigung',
    description: 'Besichtigung der Kunstwerke vor der Auktion am Wochenende.',
    date: '2025-07-02',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Auktionshaus Hamburg, Rothenbaumchaussee 7',
    maxParticipants: 30,
    currentParticipants: 18,
    status: 'ACTIVE',
    createdAt: '2025-06-30',
  },
  {
    id: '2',
    type: 'PICKUP',
    auctionNumber: 'A-2024-087',
    title: 'Fahrzeuge - Abholung',
    description: 'Abholung der ersteigerten Fahrzeuge.',
    date: '2025-07-08',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Abholzentrum München, Industriestraße 15',
    maxParticipants: 20,
    currentParticipants: 20,
    status: 'ACTIVE',
    createdAt: '2025-06-28',
  },
  {
    id: '3',
    type: 'VIEWING',
    auctionNumber: 'A-2025-003',
    title: 'Schmuck & Uhren - Besichtigung',
    description: 'Exklusive Schmuck- und Uhrenkollektion.',
    date: '2025-07-01',
    startTime: '14:00',
    endTime: '18:00',
    location: 'Auktionshaus Berlin, Unter den Linden 42',
    maxParticipants: 25,
    currentParticipants: 8,
    status: 'ACTIVE',
    createdAt: '2025-06-29',
  },
  {
    id: '4',
    type: 'PICKUP',
    auctionNumber: 'A-2025-002',
    title: 'Antiquitäten - Abholung',
    description: 'Abholung von Möbeln und Antiquitäten.',
    date: '2025-06-28',
    startTime: '10:00',
    endTime: '15:00',
    location: 'Lager Frankfurt, Gutleutstraße 89',
    maxParticipants: 15,
    currentParticipants: 12,
    status: 'COMPLETED',
    createdAt: '2025-06-25',
  },
  {
    id: '5',
    type: 'VIEWING',
    auctionNumber: 'A-2025-004',
    title: 'Oldtimer - Besichtigung',
    description: 'Besichtigung klassischer Fahrzeuge.',
    date: '2025-07-15',
    startTime: '11:00',
    endTime: '16:00',
    location: 'Köln Messe, Messeplatz 1',
    maxParticipants: 50,
    currentParticipants: 0,
    status: 'CANCELLED',
    createdAt: '2025-06-20',
  },
]

// Stats for appointments
const appointmentStats = {
  total: mockAppointments.length,
  active: mockAppointments.filter((a) => a.status === 'ACTIVE').length,
  completed: mockAppointments.filter((a) => a.status === 'COMPLETED').length,
  cancelled: mockAppointments.filter((a) => a.status === 'CANCELLED').length,
  viewing: mockAppointments.filter((a) => a.type === 'VIEWING').length,
  pickup: mockAppointments.filter((a) => a.type === 'PICKUP').length,
}

// Utility functions
function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Aktiv
        </Badge>
      )
    case 'COMPLETED':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Abgeschlossen
        </Badge>
      )
    case 'CANCELLED':
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Abgesagt
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getTypeBadge(type: string) {
  return type === 'VIEWING' ? (
    <Badge variant="outline" className="border-blue-200 text-blue-700">
      <Eye className="mr-1 h-3 w-3" />
      Besichtigung
    </Badge>
  ) : (
    <Badge variant="outline" className="border-green-200 text-green-700">
      <Users className="mr-1 h-3 w-3" />
      Abholung
    </Badge>
  )
}

function getUtilizationColor(current: number, max: number) {
  const percentage = (current / max) * 100
  if (percentage >= 100) return 'bg-red-500'
  if (percentage >= 80) return 'bg-orange-500'
  if (percentage >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Quick Actions Component
function QuickActions() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Termin
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Termin erstellen</DialogTitle>
            <DialogDescription>
              Diese Funktion wird in der nächsten Entwicklungsphase
              implementiert.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              Hier werden Sie bald ein vollständiges Formular finden, um neue
              Termine zu erstellen.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Zap className="mr-2 h-4 w-4" />
            Schnell erstellen
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schnell erstellen</DialogTitle>
            <DialogDescription>
              Termin aus vorhandenen Auktionen erstellen.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              Hier wird eine Auswahl aktueller Auktionen angezeigt, aus denen
              Sie schnell Termine erstellen können.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
    </div>
  )
}

// Stats Cards Component
function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Termine gesamt</CardTitle>
          <Calendar className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointmentStats.total}</div>
          <p className="text-muted-foreground text-xs">
            {appointmentStats.active} aktiv, {appointmentStats.completed}{' '}
            abgeschlossen
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Besichtigungen</CardTitle>
          <Eye className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointmentStats.viewing}</div>
          <p className="text-muted-foreground text-xs">
            Termine für Besichtigungen
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Abholungen</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointmentStats.pickup}</div>
          <p className="text-muted-foreground text-xs">
            Termine für Abholungen
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Durchschn. Auslastung
          </CardTitle>
          <Timer className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">73%</div>
          <p className="text-muted-foreground text-xs">
            Über alle aktiven Termine
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Appointments Table Component
function AppointmentsTable({
  appointments,
}: {
  appointments: typeof mockAppointments
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alle Termine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input placeholder="Termine durchsuchen..." className="max-w-sm" />
          </div>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(appointment.type)}
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div>
                    <h3 className="font-medium">{appointment.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {appointment.auctionNumber}
                    </p>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(appointment.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {appointment.location.split(',')[0]}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      Auslastung: {appointment.currentParticipants}/
                      {appointment.maxParticipants}
                    </span>
                    <div className="bg-muted h-2 w-20 rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getUtilizationColor(
                          appointment.currentParticipants,
                          appointment.maxParticipants
                        )}`}
                        style={{
                          width: `${Math.min(
                            (appointment.currentParticipants /
                              appointment.maxParticipants) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Appointments Page Component
export default function AppointmentsPage() {
  const [appointments] = useState(mockAppointments)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Termine</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle Besichtigungs- und Abholtermine
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Alle Termine</TabsTrigger>
            <TabsTrigger value="active">Aktiv</TabsTrigger>
            <TabsTrigger value="viewing">Besichtigungen</TabsTrigger>
            <TabsTrigger value="pickup">Abholungen</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <AppointmentsTable appointments={appointments} />
          </TabsContent>

          <TabsContent value="active">
            <AppointmentsTable
              appointments={appointments.filter((a) => a.status === 'ACTIVE')}
            />
          </TabsContent>

          <TabsContent value="viewing">
            <AppointmentsTable
              appointments={appointments.filter((a) => a.type === 'VIEWING')}
            />
          </TabsContent>

          <TabsContent value="pickup">
            <AppointmentsTable
              appointments={appointments.filter((a) => a.type === 'PICKUP')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
