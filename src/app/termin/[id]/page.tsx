'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Clock, MapPin, Calendar } from 'lucide-react'

// Mock data - same as landing page
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

// Utility functions
function getWeekDates(
  targetDate: string
): { date: string; dayName: string; dayNumber: string; isTarget: boolean }[] {
  const target = new Date(targetDate)
  const currentWeek = []

  // Find Monday of the target week
  const dayOfWeek = target.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Sunday = 0, so we need 6 days back
  const monday = new Date(target)
  monday.setDate(target.getDate() - daysFromMonday)

  // Generate week
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)

    currentWeek.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('de-DE', { weekday: 'short' }),
      dayNumber: date.getDate().toString(),
      isTarget: date.toISOString().split('T')[0] === targetDate,
    })
  }

  return currentWeek
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
        <h1 className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">
          {title}
        </h1>
      </div>
    </div>
  )
}

// Week Calendar Component
function WeekCalendar({ appointment }: { appointment: any }) {
  const weekDates = getWeekDates(appointment.date)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-gray-900 sm:text-base">
        Kalenderwoche
      </h2>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDates.map((day, index) => (
          <div
            key={index}
            className={`rounded-lg border p-2 text-center transition-colors sm:p-3 ${
              day.isTarget
                ? 'border-blue-300 bg-blue-100 text-blue-900'
                : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
          >
            <div className="mb-1 text-xs font-medium">{day.dayName}</div>
            <div className="text-sm font-semibold sm:text-lg">
              {day.dayNumber}
            </div>
            {day.isTarget && (
              <div className="mt-1">
                <div className="mx-auto h-1.5 w-1.5 rounded-full bg-blue-500 sm:h-2 sm:w-2"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Appointment Details Component
function AppointmentDetails({ appointment }: { appointment: any }) {
  const canBook =
    appointment.currentParticipants < appointment.maxParticipants &&
    appointment.status === 'ACTIVE'

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">
              Auktion {appointment.auctionNumber}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
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

        {/* Date and Time */}
        <div className="space-y-3">
          <div className="flex items-start text-sm text-gray-700">
            <Calendar className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="font-medium">{formatDate(appointment.date)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <Clock className="mr-3 h-4 w-4 flex-shrink-0 text-gray-500" />
            <span>
              {appointment.startTime} - {appointment.endTime} Uhr
            </span>
          </div>

          <div className="flex items-start text-sm text-gray-700">
            <MapPin className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="break-words">{appointment.location}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
          <div className="flex items-center text-sm text-gray-700">
            <Users className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium">
              {appointment.currentParticipants}/{appointment.maxParticipants}{' '}
              Teilnehmer
            </span>
          </div>

          {/* Progress Bar */}
          <div className="ml-4 h-2 w-16 rounded-full bg-gray-200 sm:w-20">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${Math.min((appointment.currentParticipants / appointment.maxParticipants) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Book Button */}
        <div className="pt-2">
          {canBook ? (
            <Link href={`/buchung/${appointment.id}`} className="block w-full">
              <Button className="h-12 w-full text-base font-medium">
                Termin buchen
              </Button>
            </Link>
          ) : (
            <Button disabled className="h-12 w-full text-base font-medium">
              {appointment.status === 'CANCELLED'
                ? 'Termin abgesagt'
                : 'Ausgebucht'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Appointment Details Page
export default function AppointmentDetailsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TitleBar
        title={`Auktion ${appointment.auctionNumber}: ${appointment.title}`}
      />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Week Calendar */}
        <WeekCalendar appointment={appointment} />

        {/* Appointment Details */}
        <AppointmentDetails appointment={appointment} />
      </main>
    </div>
  )
}
