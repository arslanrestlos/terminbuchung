'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  Calendar,
  UserCheck,
  UserPlus,
  LogIn,
} from 'lucide-react'

// Mock data - same as other pages
const mockAppointmentDetails = {
  '1': {
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
  '2': {
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
  '3': {
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
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getStatusBadge(currentParticipants: number, maxParticipants: number) {
  const utilizationRate = (currentParticipants / maxParticipants) * 100

  if (utilizationRate >= 100) {
    return (
      <Badge variant="destructive" className="text-xs">
        Ausgebucht
      </Badge>
    )
  }

  if (utilizationRate >= 80) {
    return (
      <Badge
        variant="default"
        className="bg-orange-500 text-xs hover:bg-orange-600"
      >
        Fast ausgebucht
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-green-100 text-xs text-green-800">
      Verfügbar
    </Badge>
  )
}

// Header Component
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex min-w-0 items-center space-x-3 sm:space-x-4">
            <Link
              href="/"
              className="flex flex-shrink-0 items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden text-sm sm:inline">Zurück</span>
            </Link>
            <div className="h-4 w-px flex-shrink-0 bg-gray-300 sm:h-6" />
            <Image
              src="/restlos-logo.svg"
              alt="Restlos Logo"
              width={80}
              height={30}
              className="h-6 w-auto flex-shrink-0 sm:h-8"
              priority
            />
          </div>

          <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-3">
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

// Title Bar Component
function TitleBar({ title }: { title: string }) {
  return (
    <div className="border-b border-blue-100 bg-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <h1 className="text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">
          <span className="block sm:inline">Buchung:</span>{' '}
          <span className="block truncate sm:inline">{title}</span>
        </h1>
      </div>
    </div>
  )
}

// Appointment Summary Component
function AppointmentSummary({ appointment }: { appointment: any }) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">
            Auktion {appointment.auctionNumber}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
            {appointment.title}
          </p>
        </div>
        <div className="flex-shrink-0">
          {getStatusBadge(
            appointment.currentParticipants,
            appointment.maxParticipants
          )}
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-start">
          <Calendar className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0 text-gray-500" />
          <span className="font-medium">{formatDate(appointment.date)}</span>
        </div>

        <div className="flex items-center">
          <Clock className="mr-3 h-4 w-4 flex-shrink-0 text-gray-500" />
          <span>
            {appointment.startTime} - {appointment.endTime} Uhr
          </span>
        </div>

        <div className="flex items-start">
          <MapPin className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0 text-gray-500" />
          <span className="break-words">{appointment.location}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium">
              {appointment.currentParticipants}/{appointment.maxParticipants}{' '}
              Teilnehmer
            </span>
          </div>
          <div className="h-2 w-16 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${Math.min((appointment.currentParticipants / appointment.maxParticipants) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Booking Options Component
function BookingOptions({ appointmentId }: { appointmentId: string }) {
  return (
    <div className="space-y-6">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
          Wie möchten Sie buchen?
        </h2>
        <p className="text-sm text-gray-600 sm:text-base">
          Wählen Sie eine der folgenden Optionen
        </p>
      </div>

      <div className="space-y-4">
        {/* Login Option */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm sm:p-6">
          <div className="mb-4 flex items-start">
            <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 sm:mr-4 sm:h-12 sm:w-12">
              <LogIn className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">
                Anmelden
              </h3>
              <p className="text-sm text-gray-600">
                Sie haben bereits ein Konto
              </p>
            </div>
          </div>
          <Link href="/login" className="block w-full">
            <Button
              className="h-11 w-full text-sm sm:h-12 sm:text-base"
              variant="outline"
            >
              Anmelden
            </Button>
          </Link>
        </div>

        {/* Guest Booking Option */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm sm:p-6">
          <div className="mb-4 flex items-start">
            <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 sm:mr-4 sm:h-12 sm:w-12">
              <UserCheck className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">
                Als Gast buchen
              </h3>
              <p className="text-sm text-gray-600">
                Schnelle Buchung ohne Registrierung
              </p>
            </div>
          </div>
          <Link
            href={`/gast-buchung/${appointmentId}`}
            className="block w-full"
          >
            <Button className="h-11 w-full text-sm sm:h-12 sm:text-base">
              Als Gast buchen
            </Button>
          </Link>
        </div>
      </div>

      {/* Register Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">oder</span>
        </div>
      </div>

      {/* Register Option */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm sm:p-6">
        <div className="mb-4 flex items-start">
          <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 sm:mr-4 sm:h-12 sm:w-12">
            <UserPlus className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">
              Neues Konto erstellen
            </h3>
            <p className="text-sm text-gray-600">
              Für zukünftige Buchungen und erweiterte Funktionen
            </p>
          </div>
        </div>
        <Link href="/register" className="block w-full">
          <Button
            className="h-11 w-full text-sm sm:h-12 sm:text-base"
            variant="outline"
          >
            Registrieren
          </Button>
        </Link>
      </div>

      {/* Benefits */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-3 text-sm font-medium text-blue-900 sm:text-base">
          Vorteile eines Kontos:
        </h4>
        <ul className="space-y-1.5 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mt-0.5 mr-2">•</span>
            <span>Buchungshistorie einsehen</span>
          </li>
          <li className="flex items-start">
            <span className="mt-0.5 mr-2">•</span>
            <span>Schnellere zukünftige Buchungen</span>
          </li>
          <li className="flex items-start">
            <span className="mt-0.5 mr-2">•</span>
            <span>E-Mail-Erinnerungen</span>
          </li>
          <li className="flex items-start">
            <span className="mt-0.5 mr-2">•</span>
            <span>Persönliche Buchungsverwaltung</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Main Booking Page Component
export default function BookingPage() {
  const params = useParams()
  const appointmentId = params?.id as string

  // In real app, fetch data based on ID
  const appointment =
    mockAppointmentDetails[appointmentId as keyof typeof mockAppointmentDetails]

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Termin nicht gefunden
          </h1>
          <p className="mx-auto mb-8 max-w-md text-gray-600">
            Der gewünschte Termin existiert nicht oder ist nicht mehr verfügbar.
          </p>
          <Link href="/">
            <Button>Zurück zur Übersicht</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Check if appointment is bookable
  const canBook =
    appointment.currentParticipants < appointment.maxParticipants &&
    appointment.status === 'ACTIVE'

  if (!canBook) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <TitleBar
          title={`Auktion ${appointment.auctionNumber}: ${appointment.title}`}
        />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
            {appointment.status === 'CANCELLED'
              ? 'Termin abgesagt'
              : 'Termin ausgebucht'}
          </h1>
          <p className="mx-auto mb-8 max-w-md text-gray-600">
            {appointment.status === 'CANCELLED'
              ? 'Dieser Termin wurde leider abgesagt.'
              : 'Alle verfügbaren Plätze sind bereits vergeben.'}
          </p>
          <Link href="/">
            <Button>Andere Termine anzeigen</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TitleBar
        title={`Auktion ${appointment.auctionNumber}: ${appointment.title}`}
      />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Appointment Summary */}
          <AppointmentSummary appointment={appointment} />

          {/* Booking Options */}
          <BookingOptions appointmentId={appointmentId} />
        </div>
      </main>
    </div>
  )
}
