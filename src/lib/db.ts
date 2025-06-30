import { PrismaClient } from '@prisma/client'

// Singleton pattern for Prisma Client to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Helper functions for common database operations
export class DatabaseService {
  // Appointments
  static async getAppointments({
    type,
    status = 'ACTIVE',
    limit = 10,
    offset = 0,
    includeBookings = false,
    dateFrom,
    dateTo,
    search,
  }: {
    type?: 'PICKUP' | 'VIEWING'
    status?: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | undefined
    limit?: number
    offset?: number
    includeBookings?: boolean
    dateFrom?: Date
    dateTo?: Date
    search?: string
  } = {}) {
    const where: any = {}
    
    if (type) where.type = type
    if (status) where.status = status
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) where.date.gte = dateFrom
      if (dateTo) where.date.lte = dateTo
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { auctionNumber: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    return await db.appointment.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        bookings: includeBookings ? {
          where: { status: 'CONFIRMED' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          }
        } : false,
        _count: {
          select: { bookings: { where: { status: 'CONFIRMED' } } }
        }
      },
      orderBy: { date: 'asc' },
      take: limit,
      skip: offset,
    })
  }

  static async getAppointmentById(id: string, includeBookings = false) {
    return await db.appointment.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        bookings: includeBookings ? {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        } : false,
        _count: {
          select: { bookings: { where: { status: 'CONFIRMED' } } }
        }
      }
    })
  }

  static async getAvailableSlots(appointmentId: string) {
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        _count: {
          select: { bookings: { where: { status: 'CONFIRMED' } } }
        }
      }
    })

    if (!appointment) return null

    return {
      appointment,
      availableSlots: appointment.maxParticipants - appointment._count.bookings,
      isAvailable: appointment._count.bookings < appointment.maxParticipants,
      utilizationRate: (appointment._count.bookings / appointment.maxParticipants) * 100
    }
  }

  // Bookings
  static async createBooking(data: {
    appointmentId: string
    userId?: string
    firstName: string
    lastName: string
    email: string
    phone: string
    bidderAccount?: string
    privacyAccepted: boolean
    marketingAccepted?: boolean
  }) {
    // Check availability first
    const slots = await this.getAvailableSlots(data.appointmentId)
    if (!slots?.isAvailable) {
      throw new Error('Termin ist bereits ausgebucht')
    }

    // Create booking and update appointment counter
    const [booking] = await db.$transaction([
      db.booking.create({
        data,
        include: {
          appointment: true,
          user: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      }),
      db.appointment.update({
        where: { id: data.appointmentId },
        data: {
          currentParticipants: {
            increment: 1
          }
        }
      })
    ])

    return booking
  }

  static async cancelBooking(bookingId: string, reason?: string) {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { appointment: true }
    })

    if (!booking) {
      throw new Error('Buchung nicht gefunden')
    }

    if (booking.status === 'CANCELLED') {
      throw new Error('Buchung bereits storniert')
    }

    // Cancel booking and decrement appointment counter
    const [updatedBooking] = await db.$transaction([
      db.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason,
        },
        include: {
          appointment: true,
          user: {
            select: { id: true, firstName: true, lastName: true, email: true }
          }
        }
      }),
      db.appointment.update({
        where: { id: booking.appointmentId },
        data: {
          currentParticipants: {
            decrement: 1
          }
        }
      })
    ])

    return updatedBooking
  }

  // Users
  static async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
      include: {
        bookings: {
          include: {
            appointment: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }

  static async createUser(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    privacyAccepted: boolean
    marketingAccepted?: boolean
  }) {
    return await db.user.create({
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    })
  }

  // Admins
  static async getAdminByEmail(email: string) {
    return await db.admin.findUnique({
      where: { email }
    })
  }

  static async updateAdminLastLogin(adminId: string) {
    return await db.admin.update({
      where: { id: adminId },
      data: { lastLogin: new Date() }
    })
  }

  // Analytics
  static async getDashboardStats() {
    const [
      totalAppointments,
      totalBookings,
      totalUsers,
      todayAppointments,
      todayBookings,
    ] = await Promise.all([
      db.appointment.count({ where: { status: 'ACTIVE' } }),
      db.booking.count({ where: { status: 'CONFIRMED' } }),
      db.user.count({ where: { isActive: true } }),
      db.appointment.count({
        where: {
          status: 'ACTIVE',
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      db.booking.count({
        where: {
          status: 'CONFIRMED',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
    ])

    // Calculate utilization rate
    const appointmentsWithBookings = await db.appointment.findMany({
      where: { status: 'ACTIVE' },
      select: {
        maxParticipants: true,
        _count: {
          select: { bookings: { where: { status: 'CONFIRMED' } } }
        }
      }
    })

    const totalCapacity = appointmentsWithBookings.reduce((sum, apt) => sum + apt.maxParticipants, 0)
    const totalBooked = appointmentsWithBookings.reduce((sum, apt) => sum + apt._count.bookings, 0)
    const utilizationRate = totalCapacity > 0 ? (totalBooked / totalCapacity) * 100 : 0

    return {
      totalAppointments,
      totalBookings,
      totalUsers,
      todayAppointments,
      todayBookings,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
    }
  }

  // Audit Logs
  static async createAuditLog(data: {
    adminId: string
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'EXPORT' | 'BULK_UPDATE' | 'BULK_DELETE'
    resource: string
    resourceId: string
    changesBefore?: any
    changesAfter?: any
    ipAddress?: string
    userAgent?: string
  }) {
    return await db.auditLog.create({
      data: {
        ...data,
        changesBefore: data.changesBefore ? JSON.stringify(data.changesBefore) : undefined,
        changesAfter: data.changesAfter ? JSON.stringify(data.changesAfter) : undefined,
      }
    })
  }

  // Cleanup functions
  static async cleanupOldAuditLogs(daysToKeep = 365) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    return await db.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })
  }

  static async anonymizeOldBookings(daysToKeep = 1095) { // 3 years
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    return await db.booking.updateMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        status: {
          in: ['CANCELLED', 'NO_SHOW']
        }
      },
      data: {
        firstName: 'Anonymisiert',
        lastName: 'Anonymisiert',
        email: 'anonymized@example.com',
        phone: 'Anonymisiert',
        bidderAccount: null,
      }
    })
  }
}

export default db