import { NextRequest, NextResponse } from 'next/server'
import { getUserFromSession } from './auth/core/session'

const privateRoutes = ['/private']
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next()

  return response
}

async function middlewareAuth(request: NextRequest) {
  console.log('Middleware Auth triggered')

  if (privateRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies)
    if (user == null) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  if (adminRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies)
    if (user == null) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|home|_next/static|_next/image|.*\\.png$).*)'],
}
