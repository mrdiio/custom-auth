import { NextRequest, NextResponse } from 'next/server'
import {
  getUserFromSession,
  updateUserSessionExpiration,
} from './auth/core/session'

const privateRoutes = ['/private']
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next()

  const user = await getUserFromSession(request.cookies)

  if (user) {
    await updateUserSessionExpiration({
      set: (key, value, options) => {
        response.cookies.set({ ...options, name: key, value })
      },
      get: (key) => request.cookies.get(key),
    })
  }

  return response
}

async function middlewareAuth(request: NextRequest) {
  const user = await getUserFromSession(request.cookies)

  if (user) {
    console.log('middleware auth')

    if (privateRoutes.includes(request.nextUrl.pathname)) {
    }

    if (adminRoutes.includes(request.nextUrl.pathname)) {
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|home|_next/static|_next/image|.*\\.png$).*)'],
}
