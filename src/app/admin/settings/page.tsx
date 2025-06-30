'use client'

import React, { useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Settings,
  Building2,
  Mail,
  Shield,
  Database,
  Bell,
  Users,
  Calendar,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Key,
  Globe,
  Palette,
  Clock,
} from 'lucide-react'

// Mock settings data
const mockSettings = {
  company: {
    name: 'Auktionshaus Premium',
    email: 'kontakt@auktionshaus-premium.de',
    phone: '+49 40 123456789',
    address: 'Rothenbaumchaussee 7, 20148 Hamburg',
    website: 'https://auktionshaus-premium.de',
    taxNumber: 'DE123456789',
  },
  booking: {
    maxBookingsPerUser: 5,
    allowGuestBookings: true,
    requirePhoneNumber: true,
    autoConfirmBookings: true,
    cancellationDeadlineHours: 24,
    reminderHours: [48, 24, 2],
  },
  email: {
    fromName: 'Auktionshaus Premium',
    fromEmail: 'noreply@auktionshaus-premium.de',
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'noreply@auktionshaus-premium.de',
    smtpPassword: '********',
    enableEmailNotifications: true,
    enableBookingConfirmations: true,
    enableReminders: true,
  },
  security: {
    sessionTimeoutMinutes: 1440, // 24 hours
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    requirePasswordChange: false,
    passwordExpiryDays: 90,
    enableTwoFactor: false,
    allowedFileTypes: ['pdf', 'jpg', 'png', 'xlsx'],
  },
  privacy: {
    dataRetentionYears: 3,
    anonymizeAfterYears: 7,
    enableGdprExport: true,
    enableGdprDeletion: true,
    cookieConsentRequired: true,
    privacyPolicyUrl: 'https://auktionshaus-premium.de/privacy',
    termsOfServiceUrl: 'https://auktionshaus-premium.de/terms',
  },
  system: {
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'INFO',
    backupFrequency: 'DAILY',
    lastBackup: '2025-06-30T02:00:00Z',
    version: '1.0.0',
    environment: 'PRODUCTION',
  },
}

// Company Settings Component
function CompanySettings() {
  const [settings, setSettings] = useState(mockSettings.company)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Unternehmensdaten
        </CardTitle>
        <CardDescription>
          Grundlegende Informationen über Ihr Unternehmen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Firmenname</Label>
            <Input
              id="companyName"
              value={settings.name}
              disabled={!isEditing}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail">E-Mail</Label>
            <Input
              id="companyEmail"
              type="email"
              value={settings.email}
              disabled={!isEditing}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone">Telefon</Label>
            <Input
              id="companyPhone"
              value={settings.phone}
              disabled={!isEditing}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Website</Label>
            <Input
              id="companyWebsite"
              value={settings.website}
              disabled={!isEditing}
              onChange={(e) =>
                setSettings({ ...settings, website: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="companyAddress">Adresse</Label>
            <Input
              id="companyAddress"
              value={settings.address}
              disabled={!isEditing}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxNumber">Steuernummer</Label>
            <Input
              id="taxNumber"
              value={settings.taxNumber}
              disabled={!isEditing}
              onChange={(e) =>
                setSettings({ ...settings, taxNumber: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Bearbeiten</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Booking Settings Component
function BookingSettings() {
  const [settings, setSettings] = useState(mockSettings.booking)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Buchungseinstellungen
        </CardTitle>
        <CardDescription>
          Konfiguration für Terminbuchungen und Limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxBookings">Max. Buchungen pro Nutzer</Label>
            <Input
              id="maxBookings"
              type="number"
              value={settings.maxBookingsPerUser}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxBookingsPerUser: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellationDeadline">Stornofrist (Stunden)</Label>
            <Input
              id="cancellationDeadline"
              type="number"
              value={settings.cancellationDeadlineHours}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cancellationDeadlineHours: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Gast-Buchungen erlauben</Label>
              <p className="text-muted-foreground text-sm">
                Buchungen ohne Registrierung zulassen
              </p>
            </div>
            <Badge
              variant={settings.allowGuestBookings ? 'default' : 'secondary'}
            >
              {settings.allowGuestBookings ? 'Aktiviert' : 'Deaktiviert'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Telefonnummer erforderlich</Label>
              <p className="text-muted-foreground text-sm">
                Telefonnummer bei Buchung verlangen
              </p>
            </div>
            <Badge
              variant={settings.requirePhoneNumber ? 'default' : 'secondary'}
            >
              {settings.requirePhoneNumber ? 'Erforderlich' : 'Optional'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Bestätigung</Label>
              <p className="text-muted-foreground text-sm">
                Buchungen automatisch bestätigen
              </p>
            </div>
            <Badge
              variant={settings.autoConfirmBookings ? 'default' : 'secondary'}
            >
              {settings.autoConfirmBookings ? 'Automatisch' : 'Manuell'}
            </Badge>
          </div>
        </div>

        <Separator />

        <div>
          <Label>E-Mail Erinnerungen (Stunden vorher)</Label>
          <p className="text-muted-foreground mb-2 text-sm">
            Zeitpunkte für automatische Erinnerungen
          </p>
          <div className="flex gap-2">
            {settings.reminderHours.map((hours, index) => (
              <Badge key={index} variant="outline">
                {hours}h
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Security Settings Component
function SecuritySettings() {
  const [settings, setSettings] = useState(mockSettings.security)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sicherheitseinstellungen
          </CardTitle>
          <CardDescription>
            Login-Sicherheit und Zugriffskontrollen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session-Timeout (Minuten)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sessionTimeoutMinutes: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max. Login-Versuche</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxLoginAttempts: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Sperrzeit (Minuten)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={settings.lockoutDurationMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    lockoutDurationMinutes: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Passwort-Ablauf (Tage)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.passwordExpiryDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    passwordExpiryDays: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Zwei-Faktor-Authentifizierung</Label>
                <p className="text-muted-foreground text-sm">
                  2FA für Admin-Accounts aktivieren
                </p>
              </div>
              <Badge
                variant={settings.enableTwoFactor ? 'default' : 'secondary'}
              >
                {settings.enableTwoFactor ? 'Aktiviert' : 'Deaktiviert'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Passwort-Änderung erzwingen</Label>
                <p className="text-muted-foreground text-sm">
                  Regelmäßige Passwort-Aktualisierung
                </p>
              </div>
              <Badge
                variant={
                  settings.requirePasswordChange ? 'default' : 'secondary'
                }
              >
                {settings.requirePasswordChange ? 'Erforderlich' : 'Optional'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Erlaubte Dateitypen</Label>
            <p className="text-muted-foreground mb-2 text-sm">
              Für Uploads zugelassene Dateiformate
            </p>
            <div className="flex flex-wrap gap-2">
              {settings.allowedFileTypes.map((type, index) => (
                <Badge key={index} variant="outline">
                  .{type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// System Status Component
function SystemStatus() {
  const [settings] = useState(mockSettings.system)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System-Status
          </CardTitle>
          <CardDescription>
            Aktueller Zustand und Systemeinstellungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Wartungsmodus</Label>
                <Badge
                  variant={
                    settings.maintenanceMode ? 'destructive' : 'secondary'
                  }
                >
                  {settings.maintenanceMode ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <Label>Debug-Modus</Label>
                <Badge variant={settings.debugMode ? 'default' : 'secondary'}>
                  {settings.debugMode ? 'Aktiviert' : 'Deaktiviert'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <Label>Umgebung</Label>
                <Badge
                  variant={
                    settings.environment === 'PRODUCTION'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {settings.environment}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <Label>Version</Label>
                <Badge variant="outline">v{settings.version}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Log-Level</Label>
                <Badge variant="outline">{settings.logLevel}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <Label>Backup-Häufigkeit</Label>
                <Badge variant="outline">{settings.backupFrequency}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <Label>Letztes Backup</Label>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {new Date(settings.lastBackup).toLocaleDateString('de-DE')}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Backup erstellen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Backup erstellen</DialogTitle>
                  <DialogDescription>
                    Vollständiges System-Backup wird erstellt.
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    Diese Funktion wird in der nächsten Version implementiert.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Backup wiederherstellen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Backup wiederherstellen</DialogTitle>
                  <DialogDescription>
                    System aus Backup-Datei wiederherstellen.
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <strong>Achtung:</strong>
                  </div>
                  <p className="mt-1 text-sm text-yellow-700">
                    Diese Aktion überschreibt alle aktuellen Daten!
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              System neustarten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Settings Page Component
export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
            <p className="text-muted-foreground">
              Systemkonfiguration und Unternehmenseinstellungen verwalten
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Konfiguration exportieren
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="company">Unternehmen</TabsTrigger>
            <TabsTrigger value="booking">Buchungen</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanySettings />
          </TabsContent>

          <TabsContent value="booking">
            <BookingSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemStatus />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
