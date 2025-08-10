import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getUserFromSession } from './session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

type User = Exclude<Awaited<ReturnType<typeof getUserFromDB>>, undefined | null>

type AuthUser = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>

// type GetCurrentUserOptions =
//   | { withFullUser: true; redirectIfNotFound?: boolean }
//   | { withFullUser?: false; redirectIfNotFound?: boolean }
//   | undefined

// async function _getCurrentUser(
//   options?: GetCurrentUserOptions
// ): Promise<User | AuthUser | null> {
function _getCurrentUser(options: {
  withFullUser: true
  redirectIfNotFound: true
}): Promise<User>
function _getCurrentUser(options: {
  withFullUser: true
  redirectIfNotFound?: false
}): Promise<User | null>
function _getCurrentUser(options: {
  withFullUser?: false
  redirectIfNotFound: true
}): Promise<AuthUser>
function _getCurrentUser(options?: {
  withFullUser?: false
  redirectIfNotFound?: false
}): Promise<AuthUser | null>
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const auth = await getUserFromSession(await cookies())

  if (auth == null) {
    if (redirectIfNotFound) return redirect('/sign-in')
    return null
  }

  if (withFullUser) {
    const user = await getUserFromDB(auth.id)
    if (user == null) throw new Error('User not found in database')
    return user
  }

  return auth
}

export const getCurrentUser = cache(_getCurrentUser)

function getUserFromDB(userId: string) {
  return db.query.users.findFirst({
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
    where: eq(users.id, userId),
  })
}
