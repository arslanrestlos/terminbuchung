import { z } from 'zod'
import {
  AppointmentType,
  BookingStatus,
  AppointmentStatus,
} from '@prisma/client'

// Base schemas
const emailSchema = z.string().email('Ungültige E-Mail-Adresse')
const phoneSchema = z
  .string()
  .min(8, 'Telefonnummer zu kurz')
  .max(20, 'Telefonnummer zu lang')
const nameSchema = z
  .string()
  .min(2, 'Mindestens 2 Zeichen')
  .max(50, 'Maximal 50 Zeichen')
const passwordSchema = z.string().min(8, 'Passwort mindestens 8 Zeichen')

// Admin schemas
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Passwort erforderlich'),
})

export const createAdminSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
})

// User/Customer schemas
export const userRegistrationSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: 'Datenschutzbestimmungen müssen akzeptiert werden',
    }),
    marketingAccepted: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  })

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Passwort erforderlich'),
})

// Appointment schemas
export const createAppointmentSchema = z
  .object({
    type: z.nativeEnum(AppointmentType, {
      required_error: 'Typ auswählen (Abholung oder Besichtigung)',
    }),
    auctionNumber: z.string().min(1, 'Auktionsnummer erforderlich').max(50),
    title: z.string().min(3, 'Titel mindestens 3 Zeichen').max(200),
    description: z
      .string()
      .max(1000, 'Beschreibung maximal 1000 Zeichen')
      .optional(),
    date: z
      .date({
        required_error: 'Datum erforderlich',
        invalid_type_error: 'Ungültiges Datum',
      })
      .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: 'Datum darf nicht in der Vergangenheit liegen',
      }),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Ungültiges Zeitformat (HH:MM)'
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Ungültiges Zeitformat (HH:MM)'
      ),
    location: z.string().min(5, 'Standort mindestens 5 Zeichen').max(200),
    maxParticipants: z
      .number()
      .min(1, 'Mindestens 1 Teilnehmer')
      .max(100, 'Maximal 100 Teilnehmer'),
  })
  .refine(
    (data) => {
      const start = data.startTime.split(':').map(Number)
      const end = data.endTime.split(':').map(Number)
      const startMinutes = start[0] * 60 + start[1]
      const endMinutes = end[0] * 60 + end[1]
      return endMinutes > startMinutes
    },
    {
      message: 'Endzeit muss nach Startzeit liegen',
      path: ['endTime'],
    }
  )

export const updateAppointmentSchema = z.object({
  id: z.string().cuid(),
  type: z.nativeEnum(AppointmentType).optional(),
  auctionNumber: z
    .string()
    .min(1, 'Auktionsnummer erforderlich')
    .max(50)
    .optional(),
  title: z.string().min(3, 'Titel mindestens 3 Zeichen').max(200).optional(),
  description: z
    .string()
    .max(1000, 'Beschreibung maximal 1000 Zeichen')
    .optional(),
  date: z
    .date({
      invalid_type_error: 'Ungültiges Datum',
    })
    .optional(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Ungültiges Zeitformat (HH:MM)')
    .optional(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Ungültiges Zeitformat (HH:MM)')
    .optional(),
  location: z
    .string()
    .min(5, 'Standort mindestens 5 Zeichen')
    .max(200)
    .optional(),
  maxParticipants: z
    .number()
    .min(1, 'Mindestens 1 Teilnehmer')
    .max(100, 'Maximal 100 Teilnehmer')
    .optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
})

// Booking schemas
export const createBookingSchema = z.object({
  appointmentId: z.string().cuid('Ungültige Termin-ID'),
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  bidderAccount: z
    .string()
    .max(100, 'Bieterkonto maximal 100 Zeichen')
    .optional(),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'Datenschutzbestimmungen müssen akzeptiert werden',
  }),
  marketingAccepted: z.boolean().optional(),
})

export const updateBookingSchema = z.object({
  id: z.string().cuid(),
  status: z.nativeEnum(BookingStatus),
  cancellationReason: z
    .string()
    .max(500, 'Begründung maximal 500 Zeichen')
    .optional(),
})

// Search and filter schemas
export const appointmentFilterSchema = z.object({
  type: z.nativeEnum(AppointmentType).optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  location: z.string().optional(),
  search: z.string().max(100).optional(),
})

export const bookingFilterSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  appointmentId: z.string().cuid().optional(),
  search: z.string().max(100).optional(),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Bulk operations schemas
export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'Mindestens eine ID erforderlich'),
})

export const bulkUpdateAppointmentStatusSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'Mindestens eine ID erforderlich'),
  status: z.nativeEnum(AppointmentStatus),
})

// Settings schema
export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
})

// Contact form schema (for public contact)
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(5, 'Betreff mindestens 5 Zeichen').max(100),
  message: z.string().min(10, 'Nachricht mindestens 10 Zeichen').max(1000),
})

// DSGVO request schemas
export const dataExportRequestSchema = z.object({
  email: emailSchema,
  reason: z.string().max(500).optional(),
})

export const dataDeleteRequestSchema = z.object({
  email: emailSchema,
  reason: z.string().max(500).optional(),
})

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

// Auction data schema (for external API)
export const auctionDataSchema = z.object({
  auctionNumber: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string(),
  category: z.string(),
  status: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED']),
})

// Type inference for TypeScript
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type AppointmentFilterInput = z.infer<typeof appointmentFilterSchema>
export type BookingFilterInput = z.infer<typeof bookingFilterSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type AuctionDataInput = z.infer<typeof auctionDataSchema>

// Helper function for form validation
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Validierungsfehler' } }
  }
}
