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
  Users,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Download,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
} from 'lucide-react'

// Mock data for users
const mockUsers = [
  {
    id: 'user1',
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'anna.schmidt@example.com',
    phone: '+49 170 98765432',
    isActive: true,
    emailVerified: true,
    emailVerifiedAt: '2025-06-15T10:30:00Z',
    privacyAccepted: true,
    marketingAccepted: false,
    createdAt: '2025-06-15T10:30:00Z',
    updatedAt: '2025-06-29T14:20:00Z',
    lastLogin: '2025-06-30T09:15:00Z',
    bookingsCount: 3,
    totalBookings: 5,
    cancelledBookings: 2,
  },
  {
    id: 'user2',
    firstName: 'Test',
    lastName: 'User',
    email: 'user@example.com',
    phone: '+49 151 11111111',
    isActive: true,
    emailVerified: true,
    emailVerifiedAt: '2025-05-20T08:45:00Z',
    privacyAccepted: true,
    marketingAccepted: true,
    createdAt: '2025-05-20T08:45:00Z',
    updatedAt: '2025-06-28T16:45:00Z',
    lastLogin: '2025-06-28T16:45:00Z',
    bookingsCount: 1,
    totalBookings: 1,
    cancelledBookings: 0,
  },
  {
    id: 'user3',
    firstName: 'Maria',
    lastName: 'Weber',
    email: 'maria.weber@email.de',
    phone: '+49 162 33333333',
    isActive: true,
    emailVerified: false,
    emailVerifiedAt: null,
    privacyAccepted: true,
    marketingAccepted: true,
    createdAt: '2025-06-25T14:10:00Z',
    updatedAt: '2025-06-25T14:10:00Z',
    lastLogin: null,
    bookingsCount: 0,
    totalBookings: 2,
    cancelledBookings: 2,
  },
  {
    id: 'user4',
    firstName: 'Klaus',
    lastName: 'Müller',
    email: 'k.mueller@company.com',
    phone: '+49 175 44444444',
    isActive: false,
    emailVerified: true,
    emailVerifiedAt: '2025-04-10T12:00:00Z',
    privacyAccepted: true,
    marketingAccepted: false,
    createdAt: '2025-04-10T12:00:00Z',
    updatedAt: '2025-06-01T10:30:00Z',
    lastLogin: '2025-05-15T14:22:00Z',
    bookingsCount: 0,
    totalBookings: 8,
    cancelledBookings: 1,
    dataDeleteRequested: '2025-06-01T10:30:00Z',
  },
  {
    id: 'user5',
    firstName: 'Sarah',
    lastName: 'Fischer',
    email: 'sarah.fischer@gmail.com',
    phone: '+49 160 55555555',
    isActive: true,
    emailVerified: true,
    emailVerifiedAt: '2025-06-01T16:20:00Z',
    privacyAccepted: true,
    marketingAccepted: true,
    createdAt: '2025-06-01T16:20:00Z',
    updatedAt: '2025-06-29T11:45:00Z',
    lastLogin: '2025-06-29T11:45:00Z',
    bookingsCount: 2,
    totalBookings: 2,
    cancelledBookings: 0,
  },
]

// Stats for users
const userStats = {
  total: mockUsers.length,
  active: mockUsers.filter((u) => u.isActive).length,
  inactive: mockUsers.filter((u) => !u.isActive).length,
  verified: mockUsers.filter((u) => u.emailVerified).length,
  unverified: mockUsers.filter((u) => !u.emailVerified).length,
  marketingAccepted: mockUsers.filter((u) => u.marketingAccepted).length,
  withBookings: mockUsers.filter((u) => u.bookingsCount > 0).length,
  deletionRequested: mockUsers.filter((u) => u.dataDeleteRequested).length,
}

// Utility functions
function getStatusBadge(user: (typeof mockUsers)[0]) {
  if (user.dataDeleteRequested) {
    return (
      <Badge variant="destructive">
        <Trash2 className="mr-1 h-3 w-3" />
        Löschung angefordert
      </Badge>
    )
  }

  if (!user.isActive) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        <XCircle className="mr-1 h-3 w-3" />
        Inaktiv
      </Badge>
    )
  }

  if (!user.emailVerified) {
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        <AlertCircle className="mr-1 h-3 w-3" />
        Nicht verifiziert
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-green-100 text-green-800">
      <CheckCircle className="mr-1 h-3 w-3" />
      Aktiv
    </Badge>
  )
}

function getVerificationBadge(verified: boolean) {
  return verified ? (
    <Badge variant="outline" className="border-green-200 text-green-700">
      <Shield className="mr-1 h-3 w-3" />
      Verifiziert
    </Badge>
  ) : (
    <Badge variant="outline" className="border-orange-200 text-orange-700">
      <AlertCircle className="mr-1 h-3 w-3" />
      Unverifiziert
    </Badge>
  )
}

function formatDateTime(dateString: string | null) {
  if (!dateString) return 'Nie'
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Neuer Nutzer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neuen Nutzer anlegen</DialogTitle>
            <DialogDescription>
              Manuell einen neuen Benutzeraccount erstellen.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              Diese Funktion wird in der nächsten Entwicklungsphase
              implementiert.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportieren
      </Button>

      <Button variant="outline">
        <Mail className="mr-2 h-4 w-4" />
        Newsletter
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
          <CardTitle className="text-sm font-medium">Nutzer gesamt</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.total}</div>
          <p className="text-muted-foreground text-xs">
            {userStats.active} aktiv, {userStats.inactive} inaktiv
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            E-Mail verifiziert
          </CardTitle>
          <Shield className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.verified}</div>
          <p className="text-muted-foreground text-xs">
            {userStats.unverified} noch nicht verifiziert
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mit Buchungen</CardTitle>
          <Activity className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.withBookings}</div>
          <p className="text-muted-foreground text-xs">
            Haben mindestens eine Buchung
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Marketing OK</CardTitle>
          <Mail className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userStats.marketingAccepted}
          </div>
          <p className="text-muted-foreground text-xs">Newsletter-Empfänger</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Users List Component
function UsersList({ users }: { users: typeof mockUsers }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alle Nutzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input placeholder="Nutzer durchsuchen..." className="max-w-sm" />
          </div>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(user)}
                    {getVerificationBadge(user.emailVerified)}
                    {user.marketingAccepted && (
                      <Badge
                        variant="outline"
                        className="border-blue-200 text-blue-700"
                      >
                        <Mail className="mr-1 h-3 w-3" />
                        Newsletter
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <h3 className="font-medium">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="text-muted-foreground space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Buchungen</h4>
                      <div className="text-muted-foreground space-y-1 text-sm">
                        <div>Aktiv: {user.bookingsCount}</div>
                        <div>Gesamt: {user.totalBookings}</div>
                        <div>Storniert: {user.cancelledBookings}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Aktivität</h4>
                      <div className="text-muted-foreground space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Registriert: {formatDate(user.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Letzter Login: {formatDateTime(user.lastLogin)}
                        </div>
                        {user.emailVerifiedAt && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Verifiziert: {formatDate(user.emailVerifiedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.dataDeleteRequested && (
                    <div className="rounded border border-red-200 bg-red-50 p-2 text-sm">
                      <strong>DSGVO-Löschungsantrag:</strong>{' '}
                      {formatDateTime(user.dataDeleteRequested)}
                      <br />
                      <span className="text-muted-foreground text-xs">
                        Nutzer hat die Löschung seiner Daten angefordert.
                      </span>
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
                        <DialogTitle>Nutzerdetails</DialogTitle>
                        <DialogDescription>
                          Vollständige Informationen zum Nutzer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Persönliche Daten</h4>
                          <p>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {user.email}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {user.phone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">DSGVO & Einstellungen</h4>
                          <div className="space-y-1 text-sm">
                            <div>
                              Datenschutz:{' '}
                              {user.privacyAccepted
                                ? '✓ Akzeptiert'
                                : '✗ Nicht akzeptiert'}
                            </div>
                            <div>
                              Marketing:{' '}
                              {user.marketingAccepted
                                ? '✓ Akzeptiert'
                                : '✗ Abgelehnt'}
                            </div>
                            <div>
                              E-Mail verifiziert:{' '}
                              {user.emailVerified ? '✓ Ja' : '✗ Nein'}
                            </div>
                            <div>
                              Account aktiv: {user.isActive ? '✓ Ja' : '✗ Nein'}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Buchungsstatistiken</h4>
                          <div className="space-y-1 text-sm">
                            <div>Aktuelle Buchungen: {user.bookingsCount}</div>
                            <div>Buchungen gesamt: {user.totalBookings}</div>
                            <div>Stornierungen: {user.cancelledBookings}</div>
                            <div>
                              Stornierungsrate:{' '}
                              {user.totalBookings > 0
                                ? Math.round(
                                    (user.cancelledBookings /
                                      user.totalBookings) *
                                      100
                                  ) + '%'
                                : '0%'}
                            </div>
                          </div>
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

// Main Users Page Component
export default function UsersPage() {
  const [users] = useState(mockUsers)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nutzer</h1>
            <p className="text-muted-foreground">
              Verwalten Sie alle registrierten Benutzerkonten
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Alle Nutzer</TabsTrigger>
            <TabsTrigger value="active">Aktiv</TabsTrigger>
            <TabsTrigger value="unverified">Unverifiziert</TabsTrigger>
            <TabsTrigger value="marketing">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <UsersList users={users} />
          </TabsContent>

          <TabsContent value="active">
            <UsersList
              users={users.filter((u) => u.isActive && u.emailVerified)}
            />
          </TabsContent>

          <TabsContent value="unverified">
            <UsersList users={users.filter((u) => !u.emailVerified)} />
          </TabsContent>

          <TabsContent value="marketing">
            <UsersList users={users.filter((u) => u.marketingAccepted)} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
