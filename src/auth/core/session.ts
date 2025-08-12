import { userRoles } from '@/db/schema'
import { redisClient } from '@/redis/redis-client'
import z from 'zod'
import { v7 } from 'uuid'

const COOKIE_SESSION_KEY = 'session-id'
const SESSION_EXPIRATION_SECONDS = 60 * 60 // One hour in seconds
const SESSION_REFRESH_INTERVAL = 5 * 60 * 1000 // Five minutes in milliseconds

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
  lastRefreshed: z.number().optional(),
})

export type UserSession = z.infer<typeof sessionSchema>

export type Cookies = {
  set: (
    key: string,
    value: string,
    options?: {
      secure?: boolean
      httpOnly?: boolean
      sameSite?: 'lax' | 'strict'
      maxAge?: number
    }
  ) => void
  get: (key: string) => { name: string; value: string } | undefined
  delete: (key: string) => void
}

export function getUserFromSession(cookies: Pick<Cookies, 'get'>) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
  if (!sessionId) return null

  return getUserSessionById(sessionId)
}

export async function createUserSession(
  user: UserSession,
  cookies: Pick<Cookies, 'set'>
) {
  const sessionId = v7()
  await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  })

  setCookie(sessionId, cookies)
}

export async function updateUserSessionData(
  user: UserSession,
  cookies: Pick<Cookies, 'get' | 'set'>
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value

  if (sessionId == null) return null

  if (sessionId) await redisClient.del(`session:${sessionId}`)

  const newSessionId = v7()
  await redisClient.set(`session:${newSessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  })

  setCookie(newSessionId, cookies)
}

export async function updateUserSessionExpiration(
  cookies: Pick<Cookies, 'get' | 'set'>
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
  if (sessionId == null) return null

  const session = await getUserSessionById(sessionId)
  if (session == null) return

  const now = Date.now()

  if (
    session.lastRefreshed &&
    now - session.lastRefreshed < SESSION_REFRESH_INTERVAL
  ) {
    // Tidak perlu update expiry, terlalu cepat
    return
  }

  session.lastRefreshed = now
  await redisClient.set(`session:${sessionId}`, session, {
    ex: SESSION_EXPIRATION_SECONDS,
  })
  setCookie(sessionId, cookies)
  console.log('User session updated:', sessionId)
}

export async function removeUserFromSession(
  cookies: Pick<Cookies, 'get' | 'delete'>
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
  if (sessionId == null) return null

  await redisClient.del(`session:${sessionId}`)
  cookies.delete(COOKIE_SESSION_KEY)
}

function setCookie(sessionId: string, cookies: Pick<Cookies, 'set'>) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: SESSION_EXPIRATION_SECONDS,
  })
}

async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`)
  const { success, data: user } = sessionSchema.safeParse(rawUser)

  return success ? user : null
}
