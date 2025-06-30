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
  BookOpen,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  AlertTriangle,
} from 'lucide-react'

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    appointmentId: '1',
    appointmentTitle: 'Kunstauktion - Besichtigung',
    appointmentDate: '2025-07-02',
    appointmentTime: '10:00 - 16:00',
    appointmentLocation: 'Hamburg',
    userId: null,
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 160 12345678',
    bidderAccount: 'MM-2024-001 - Max Mustermann',
    status: 'CONFIRMED',
    privacyAccepted: true,
    marketingAccepted: true,
    createdAt: '2025-06-30T14:30:00Z',
    checkedIn: false,
  },
  {
    id: '2',
    appointmentId: '1',
    appointmentTitle: 'Kunstauktion - Besichtigung',
    appointmentDate: '2025-07-02',
    appointmentTime: '10:00 - 16:00',
    appointmentLocation: 'Hamburg',
    userId: 'user1',
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'anna.schmidt@example.com',
    phone: '+49 170 98765432',
    bidderAccount: 'AS-2024-042 - Anna Schmidt',
    status: 'CONFIRMED',
    privacyAccepted: true,
    marketingAccepted: false,
    createdAt: '2025-06-29T09:15:00Z',
    checkedIn: true,
  },
  {
    id: '3',
    appointmentId: '2',
    appointmentTitle: 'Fahrzeuge - Abholung',
    appointmentDate: '2025-07-08',
    appointmentTime: '09:00 - 17:00',
    appointmentLocation: 'München',
    userId: 'user2',
    firstName: 'Test',
    lastName: 'User',
    email: 'user@example.com',
    phone: '+49 151 11111111',
    bidderAccount: 'TU-2024-099 - Test User',
    status: 'CONFIRMED',
    privacyAccepted: true,
    marketingAccepted: true,
    createdAt: '2025-06-28T16:45:00Z',
    checkedIn: false,
  },
  {
    id: '4',
    appointmentId: '3',
    appointmentTitle: 'Schmuck & Uhren - Besichtigung',
    appointmentDate: '2025-07-01',
    appointmentTime: '14:00 - 18:00',
    appointmentLocation: 'Berlin',
    userId: null,
    firstName: 'Maria',
    lastName: 'Müller',
    email: 'maria.mueller@email.de',
    phone: '+49 175 55555555',
    bidderAccount: 'MM-2025-001 - Maria Müller',
    status: 'CANCELLED',
    privacyAccepted: true,
    marketingAccepted: false,
    createdAt: '2025-06-25T11:20:00Z',
    checkedIn: false,
    cancelledAt: '2025-06-29T08:30:00Z',
    cancellationReason: 'Terminkonflikt',
  },
  {
    id: '5',
    appointmentId: '2',
    appointmentTitle: 'Fahrzeuge - Abholung',
    appointmentDate: '2025-07-08',
    appointmentTime: '09:00 - 17:00',
    appointmentLocation: 'München',
    userId: null,
    firstName: 'Peter',
    lastName: 'Weber',
    email: 'p.weber@company.com',
    phone: '+49 162 77777777',
    bidderAccount: 'PW-2025-003 - Peter Weber',
    status: 'NO_SHOW',
    privacyAccepted: true,
    marketingAccepted: true,
    createdAt: '2025-06-20T13:10:00Z',
    checkedIn: false,
  },
]

// Stats for bookings
const bookingStats = {
  total: mockBookings.length,
  confirmed: mockBookings.filter((b) => b.status === 'CONFIRMED').length,
  cancelled: mockBookings.filter((b) => b.status === 'CANCELLED').length,
  noShow: mockBookings.filter((b) => b.status === 'NO_SHOW').length,
  checkedIn: mockBookings.filter((b) => b.checkedIn).length,
  guests: mockBookings.filter((b) => !b.userId).length,
  registeredUsers: mockBookings.filter((b) => b.userId).length,
}

// Utility functions
function getStatusBadge(status: string, checkedIn?: boolean) {
  if (checkedIn) {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        Eingecheckt
      </Badge>
    )
  }

  switch (status) {
    case 'CONFIRMED':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Bestätigt
        </Badge>
      )
    case 'CANCELLED':
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Storniert
        </Badge>
      )
    case 'NO_SHOW':
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Nicht erschienen
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getUserTypeBadge(userId: string | null) {
  return userId ? (
    <Badge variant="outline" className="border-blue-200 text-blue-700">
      <User className="mr-1 h-3 w-3" />
      Registriert
    </Badge>
  ) : (
    <Badge variant="outline" className="border-gray-200 text-gray-700">
      <User className="mr-1 h-3 w-3" />
      Gast
    </Badge>
  )
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Exportieren
      </Button>

      <Button variant="outline">
        <Mail className="mr-2 h-4 w-4" />
        E-Mail senden
      </Button>

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
          <CardTitle className="text-sm font-medium">
            Buchungen gesamt
          </CardTitle>
          <BookOpen className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingStats.total}</div>
          <p className="text-muted-foreground text-xs">
            {bookingStats.confirmed} bestätigt, {bookingStats.cancelled}{' '}
            storniert
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eingecheckt</CardTitle>
          <CheckCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingStats.checkedIn}</div>
          <p className="text-muted-foreground text-xs">
            Von {bookingStats.confirmed} bestätigten
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gast-Buchungen</CardTitle>
          <User className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingStats.guests}</div>
          <p className="text-muted-foreground text-xs">Ohne Account gebucht</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Stornierungsrate
          </CardTitle>
          <XCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((bookingStats.cancelled / bookingStats.total) * 100)}%
          </div>
          <p className="text-muted-foreground text-xs">
            {bookingStats.cancelled} von {bookingStats.total}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Bookings List Component
function BookingsList({ bookings }: { bookings: typeof mockBookings }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alle Buchungen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buchungen durchsuchen..."
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(booking.status, booking.checkedIn)}
                    {getUserTypeBadge(booking.userId)}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium">
                        {booking.firstName} {booking.lastName}
                      </h3>
                      <div className="text-muted-foreground space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {booking.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {booking.phone}
                        </div>
                        {booking.bidderAccount && (
                          <div className="text-xs">
                            Bieterkonto: {booking.bidderAccount}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">
                        {booking.appointmentTitle}
                      </h4>
                      <div className="text-muted-foreground space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(booking.appointmentDate)} •{' '}
                          {booking.appointmentTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.appointmentLocation}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Gebucht: {formatDateTime(booking.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.status === 'CANCELLED' &&
                    booking.cancellationReason && (
                      <div className="rounded border border-red-200 bg-red-50 p-2 text-sm">
                        <strong>Stornierungsgrund:</strong>{' '}
                        {booking.cancellationReason}
                        {booking.cancelledAt && (
                          <div className="text-muted-foreground mt-1 text-xs">
                            Storniert am: {formatDateTime(booking.cancelledAt)}
                          </div>
                        )}
                      </div>
                    )}
                </div>

                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Buchungsdetails</DialogTitle>
                        <DialogDescription>
                          Vollständige Informationen zur Buchung
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Kunde</h4>
                          <p>
                            {booking.firstName} {booking.lastName}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {booking.email}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {booking.phone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">DSGVO</h4>
                          <p className="text-sm">
                            Datenschutz:{' '}
                            {booking.privacyAccepted
                              ? '✓ Akzeptiert'
                              : '✗ Nicht akzeptiert'}
                          </p>
                          <p className="text-sm">
                            Marketing:{' '}
                            {booking.marketingAccepted
                              ? '✓ Akzeptiert'
                              : '✗ Nicht akzeptiert'}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
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

// Main Bookings Page Component
export default function BookingsPage() {
  const [bookings] = useState(mockBookings)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Buchungen</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle Terminbuchungen und Kundendaten
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Alle Buchungen</TabsTrigger>
            <TabsTrigger value="confirmed">Bestätigt</TabsTrigger>
            <TabsTrigger value="cancelled">Storniert</TabsTrigger>
            <TabsTrigger value="checkedIn">Eingecheckt</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <BookingsList bookings={bookings} />
          </TabsContent>

          <TabsContent value="confirmed">
            <BookingsList
              bookings={bookings.filter((b) => b.status === 'CONFIRMED')}
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <BookingsList
              bookings={bookings.filter((b) => b.status === 'CANCELLED')}
            />
          </TabsContent>

          <TabsContent value="checkedIn">
            <BookingsList bookings={bookings.filter((b) => b.checkedIn)} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
