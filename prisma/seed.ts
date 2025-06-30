import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create first admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@termin-app.com' },
    update: {},
    create: {
      email: 'admin@termin-app.com',
      name: 'System Administrator',
      password: hashedPassword,
      isActive: true,
    },
  })

  console.log('✅ Admin User erstellt:', {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  })

  // Create some test appointments
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const appointment1 = await prisma.appointment.upsert({
    where: { id: 'test-appointment-1' },
    update: {},
    create: {
      id: 'test-appointment-1',
      type: 'VIEWING',
      auctionNumber: 'A-2025-001',
      title: 'Kunstauktion - Besichtigung',
      description: 'Besichtigung der Kunstwerke vor der Auktion am Wochenende.',
      date: tomorrow,
      startTime: '10:00',
      endTime: '16:00',
      location: 'Auktionshaus Hamburg, Rothenbaumchaussee 7, 20148 Hamburg',
      maxParticipants: 30,
      currentParticipants: 8,
      status: 'ACTIVE',
      createdBy: admin.id,
    },
  })

  const appointment2 = await prisma.appointment.upsert({
    where: { id: 'test-appointment-2' },
    update: {},
    create: {
      id: 'test-appointment-2',
      type: 'PICKUP',
      auctionNumber: 'A-2024-087',
      title: 'Fahrzeuge - Abholung',
      description:
        'Abholung der ersteigerten Fahrzeuge. Bitte Ausweis und Kaufbestätigung mitbringen.',
      date: nextWeek,
      startTime: '09:00',
      endTime: '17:00',
      location: 'Abholzentrum München, Industriestraße 15, 80333 München',
      maxParticipants: 20,
      currentParticipants: 15,
      status: 'ACTIVE',
      createdBy: admin.id,
    },
  })

  console.log('✅ Test Appointments erstellt:', [
    { id: appointment1.id, title: appointment1.title },
    { id: appointment2.id, title: appointment2.title },
  ])

  // Create some test bookings
  const booking1 = await prisma.booking.upsert({
    where: { id: 'test-booking-1' },
    update: {},
    create: {
      id: 'test-booking-1',
      appointmentId: appointment1.id,
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@example.com',
      phone: '+49 160 12345678',
      bidderAccount: 'MM-2024-001 - Max Mustermann',
      privacyAccepted: true,
      marketingAccepted: true,
      status: 'CONFIRMED',
    },
  })

  const booking2 = await prisma.booking.upsert({
    where: { id: 'test-booking-2' },
    update: {},
    create: {
      id: 'test-booking-2',
      appointmentId: appointment1.id,
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna.schmidt@example.com',
      phone: '+49 170 98765432',
      bidderAccount: 'AS-2024-042 - Anna Schmidt',
      privacyAccepted: true,
      marketingAccepted: false,
      status: 'CONFIRMED',
    },
  })

  console.log('✅ Test Bookings erstellt:', [
    { id: booking1.id, name: `${booking1.firstName} ${booking1.lastName}` },
    { id: booking2.id, name: `${booking2.firstName} ${booking2.lastName}` },
  ])

  // Create a test user account
  const userPassword = await bcrypt.hash('user123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '+49 151 11111111',
      password: userPassword,
      privacyAccepted: true,
      marketingAccepted: true,
      isActive: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  console.log('✅ Test User erstellt:', {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  })

  // Create a booking for the test user
  const userBooking = await prisma.booking.upsert({
    where: { id: 'test-user-booking-1' },
    update: {},
    create: {
      id: 'test-user-booking-1',
      appointmentId: appointment2.id,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      bidderAccount: 'TU-2024-099 - Test User',
      privacyAccepted: true,
      marketingAccepted: true,
      status: 'CONFIRMED',
    },
  })

  console.log('✅ User Booking erstellt:', {
    id: userBooking.id,
    appointment: appointment2.title,
  })

  // Create some basic settings
  await prisma.setting.upsert({
    where: { key: 'company_name' },
    update: {},
    create: {
      key: 'company_name',
      value: 'Auktionshaus Premium',
      updatedBy: admin.id,
    },
  })

  await prisma.setting.upsert({
    where: { key: 'contact_email' },
    update: {},
    create: {
      key: 'contact_email',
      value: 'kontakt@auktionshaus-premium.de',
      updatedBy: admin.id,
    },
  })

  await prisma.setting.upsert({
    where: { key: 'max_bookings_per_user' },
    update: {},
    create: {
      key: 'max_bookings_per_user',
      value: '5',
      updatedBy: admin.id,
    },
  })

  console.log('✅ Basic Settings erstellt')

  console.log('\n🎉 Database seeding completed!')
  console.log('\n📋 Login-Daten:')
  console.log('👤 Admin Login:')
  console.log('   Email: admin@termin-app.com')
  console.log('   Password: admin123')
  console.log('\n👥 Test User Login:')
  console.log('   Email: user@example.com')
  console.log('   Password: user123')
  console.log(
    '\n🗄️  Database Dashboard: http://localhost:5555 (npx prisma studio)'
  )
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
