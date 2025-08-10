import { userRoles } from '@/db/schema'
import { redisClient } from '@/redis/redis-client'
import crypto from 'crypto'
import z from 'zod'

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = 'session-id'

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
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
      expires?: number
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
  const sessionId = crypto.randomBytes(512).toString('hex').normalize()
  await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  })

  setCookie(sessionId, cookies)
}

function setCookie(sessionId: string, cookies: Pick<Cookies, 'set'>) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  })
}

async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`)
  const { success, data: user } = sessionSchema.safeParse(rawUser)

  return success ? user : null
}
