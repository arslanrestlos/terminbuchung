'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, MapPin, ChevronRight, Eye, Package, Search } from 'lucide-react'

// Mock data für Termine
const mockAppointments = [
  {
    id: '1',
    type: 'VIEWING',
    auctionNumber: '1383',
    title:
      'Insolvenzauktion Bikewerk Nürnberg GmbH - Fahrräder, Zubehör, Bekleidung, Ausrüstung & Werkstatt- und Ladeneinrichtung',
    date: '2025-07-02',
    startTime: '10:00',
    endTime: '11:00',
    location: 'Peter-Henlein-Straße 27A, 90443 Nürnberg',
    maxParticipants: 15,
    currentParticipants: 3,
    status: 'ACTIVE',
  },
  {
    id: '2',
    type: 'PICKUP',
    auctionNumber: '1384',
    title: 'Abholung Fahrzeuge - Mercedes, BMW, Audi verschiedene Baujahre',
    date: '2025-07-08',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Industriestraße 15, 80333 München',
    maxParticipants: 20,
    currentParticipants: 20,
    status: 'ACTIVE',
  },
  {
    id: '3',
    type: 'VIEWING',
    auctionNumber: '1385',
    title: 'Schmuck & Uhren Besichtigung - Rolex, Cartier, Diamanten',
    date: '2025-07-01',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Unter den Linden 42, 10117 Berlin',
    maxParticipants: 25,
    currentParticipants: 20,
    status: 'ACTIVE',
  },
  {
    id: '4',
    type: 'VIEWING',
    auctionNumber: '1386',
    title: 'Büroausstattung und IT-Equipment der ABC GmbH',
    date: '2025-07-03',
    startTime: '11:00',
    endTime: '15:00',
    location: 'Messeplatz 1, 50679 Köln',
    maxParticipants: 30,
    currentParticipants: 12,
    status: 'ACTIVE',
  },
  {
    id: '5',
    type: 'PICKUP',
    auctionNumber: '1387',
    title: 'Elektronik Abholung - Computer, Laptops, Smartphones',
    date: '2025-07-05',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Gutleutstraße 89, 60329 Frankfurt',
    maxParticipants: 15,
    currentParticipants: 8,
    status: 'ACTIVE',
  },
]

// Utility functions
function calculateDuration(startTime: string, endTime: string): number {
  const start = startTime.split(':').map(Number)
  const end = endTime.split(':').map(Number)
  const startMinutes = start[0] * 60 + start[1]
  const endMinutes = end[0] * 60 + end[1]
  return endMinutes - startMinutes
}

function getStatusBadge(currentParticipants: number, maxParticipants: number) {
  const utilizationRate = (currentParticipants / maxParticipants) * 100

  if (utilizationRate >= 100) {
    return (
      <Badge variant="destructive" className="text-xs whitespace-nowrap">
        Ausgebucht
      </Badge>
    )
  }

  if (utilizationRate >= 80) {
    return (
      <Badge
        variant="default"
        className="bg-orange-500 text-xs whitespace-nowrap hover:bg-orange-600"
      >
        Fast ausgebucht
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="bg-green-100 text-xs whitespace-nowrap text-green-800"
    >
      Verfügbar
    </Badge>
  )
}

function truncateTitle(title: string, maxLength: number = 70): string {
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength) + '...'
}

// Header Component
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/restlos-logo.svg"
              alt="Restlos Logo"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-10"
              priority
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                Anmelden
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="text-xs sm:text-sm">
                Registrieren
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

// Search Component
function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
}) {
  return (
    <div className="relative w-full">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
      <Input
        placeholder="Termine durchsuchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10"
      />
    </div>
  )
}

// Appointment Card Component
function AppointmentCard({
  appointment,
}: {
  appointment: (typeof mockAppointments)[0]
}) {
  const duration = calculateDuration(appointment.startTime, appointment.endTime)
  const durationText =
    duration >= 60
      ? `${Math.floor(duration / 60)}h ${duration % 60}min`
      : `${duration} min`

  return (
    <Link href={`/termin/${appointment.id}`} className="block">
      <div className="relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(
            appointment.currentParticipants,
            appointment.maxParticipants
          )}
        </div>

        {/* Arrow - Right Middle */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        {/* Content */}
        <div className="space-y-2 pr-8 sm:pr-12">
          {/* Title */}
          <div>
            <h3 className="text-sm leading-tight font-medium text-gray-900 sm:text-base">
              <span className="text-blue-600">
                Auktion {appointment.auctionNumber}:
              </span>{' '}
              <span className="truncate font-semibold">
                <span className="hidden sm:inline">
                  {truncateTitle(appointment.title, 70)}
                </span>
                <span className="sm:hidden">
                  {truncateTitle(appointment.title, 50)}
                </span>
              </span>
            </h3>
          </div>

          {/* Duration */}
          <div className="flex items-center text-xs text-gray-600 sm:text-sm">
            <Clock className="mr-1.5 h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span>Zeit: {durationText}</span>
          </div>

          {/* Location */}
          <div className="flex items-start text-xs text-gray-600 sm:text-sm">
            <MapPin className="mt-0.5 mr-1.5 h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">Standort: {appointment.location}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Empty State Component
function EmptyState({
  type,
  icon: Icon,
}: {
  type: string
  icon: React.ElementType
}) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="mb-4 text-gray-300">
        <Icon className="mx-auto h-12 w-12" />
      </div>
      <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
        Keine {type} verfügbar
      </h3>
      <p className="text-sm text-gray-500">
        Aktuell sind keine Termine für {type} verfügbar.
      </p>
    </div>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [appointments] = useState(mockAppointments)

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.auctionNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const viewingAppointments = filteredAppointments.filter(
    (a) => a.type === 'VIEWING'
  )
  const pickupAppointments = filteredAppointments.filter(
    (a) => a.type === 'PICKUP'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl">
            Terminbuchung
          </h1>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="viewing" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger
              value="viewing"
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Besichtigung</span>
              <span className="sm:hidden">Besicht.</span>
            </TabsTrigger>
            <TabsTrigger
              value="pickup"
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Abholung</span>
              <span className="sm:hidden">Abhol.</span>
            </TabsTrigger>
          </TabsList>

          {/* Viewing Appointments */}
          <TabsContent value="viewing" className="space-y-3 sm:space-y-4">
            {viewingAppointments.length > 0 ? (
              <div className="space-y-3">
                {viewingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="Besichtigungstermine" icon={Eye} />
            )}
          </TabsContent>

          {/* Pickup Appointments */}
          <TabsContent value="pickup" className="space-y-3 sm:space-y-4">
            {pickupAppointments.length > 0 ? (
              <div className="space-y-3">
                {pickupAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="Abholtermine" icon={Package} />
            )}
          </TabsContent>
        </Tabs>

        {/* No Search Results */}
        {searchTerm && filteredAppointments.length === 0 && (
          <div className="px-4 py-12 text-center">
            <div className="mb-4 text-gray-300">
              <Search className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
              Keine Suchergebnisse
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Für "{searchTerm}" wurden keine Termine gefunden.
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              size="sm"
            >
              Suche zurücksetzen
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
