import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { auth } from '@/lib/auth'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Termin App - Auktionshaus Terminverwaltung',
  description: 'Professionelle Terminverwaltung für Auktionshäuser',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="de">
      <body className={inter.className}>
        <AuthSessionProvider session={session}>
          {children}
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
