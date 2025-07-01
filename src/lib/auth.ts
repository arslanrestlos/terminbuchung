import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db'
import { adminLoginSchema } from '@/lib/validations'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'admin'
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'admin'
  }
}

export const authConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          // Validate input
          const validatedFields = adminLoginSchema.safeParse(credentials)

          if (!validatedFields.success) {
            return null
          }

          const { email, password } = validatedFields.data

          // Find admin user
          const admin = await db.admin.findUnique({
            where: { email },
          })

          if (!admin || !admin.isActive) {
            return null
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(password, admin.password)

          if (!passwordMatch) {
            return null
          }

          // Update last login
          await db.admin.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
          })

          // Return user object
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: 'admin' as const,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
