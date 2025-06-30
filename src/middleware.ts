import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isLoginPage = nextUrl.pathname === '/admin/login'

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (isLoginPage) {
      // Redirect logged-in users away from login page
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', nextUrl))
      }
      return NextResponse.next()
    }

    // Require authentication for all other admin pages
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/(?!auth)|_next/static|_next/image|favicon.ico).*)'],
}
