// Prisma types
export type {
  Admin,
  User,
  Appointment,
  Booking,
  AuditLog,
  Setting,
  AppointmentType,
  AppointmentStatus,
  BookingStatus,
  AuditAction,
} from '@prisma/client'

// Extended types with relations
export interface AppointmentWithBookings extends Appointment {
  bookings: Booking[]
  creator: Admin
  _count: {
    bookings: number
  }
}

export interface BookingWithRelations extends Booking {
  appointment: Appointment
  user?: User
}

export interface UserWithBookings extends User {
  bookings: BookingWithRelations[]
}

// Form types
export interface CreateAppointmentData {
  type: AppointmentType
  auctionNumber: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  location: string
  maxParticipants: number
}

export interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bidderAccount?: string
  privacyAccepted: boolean
  marketingAccepted?: boolean
}

export interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  privacyAccepted: boolean
  marketingAccepted?: boolean
}

export interface AdminLoginData {
  email: string
  password: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Dashboard types
export interface DashboardStats {
  totalAppointments: number
  totalBookings: number
  totalUsers: number
  utilizationRate: number
  todayAppointments: number
  todayBookings: number
}

export interface AppointmentStats {
  total: number
  active: number
  completed: number
  cancelled: number
  utilizationRate: number
}

// Filter & Search types
export interface AppointmentFilter {
  type?: AppointmentType
  status?: AppointmentStatus
  dateFrom?: Date
  dateTo?: Date
  location?: string
  search?: string
}

export interface BookingFilter {
  status?: BookingStatus
  dateFrom?: Date
  dateTo?: Date
  appointmentId?: string
  search?: string
}

// Auction API types (for future integration)
export interface AuctionData {
  auctionNumber: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  category: string
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
}

// Email template types
export interface EmailTemplate {
  to: string
  subject: string
  template: 'booking-confirmation' | 'booking-reminder' | 'booking-cancelled'
  data: {
    userName: string
    appointment: Appointment
    booking: Booking
    [key: string]: any
  }
}

// Utility types
export type AppointmentStatusBadge = {
  [K in AppointmentStatus]: {
    label: string
    color: 'green' | 'yellow' | 'red' | 'gray'
    icon: string
  }
}

export type BookingStatusBadge = {
  [K in BookingStatus]: {
    label: string
    color: 'green' | 'red' | 'yellow'
    icon: string
  }
}

// Form validation schemas (we'll use with Zod)
export interface ValidationSchema {
  appointment: any
  booking: any
  user: any
  admin: any
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: number
}

// Modal types
export interface ModalState {
  isOpen: boolean
  type?: 'create' | 'edit' | 'delete' | 'view'
  data?: any
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

export interface FieldError {
  field: string
  message: string
}

// Success/Error responses
export interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: AppError
  fieldErrors?: FieldError[]
}
