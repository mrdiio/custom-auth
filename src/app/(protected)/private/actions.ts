'use server'
import { getCurrentUser } from '@/auth/core/current-user'
import { updateUserSessionData } from '@/auth/core/session'
import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function toggleRole() {
  const user = await getCurrentUser({ redirectIfNotFound: true })

  const [updatedUser] = await db
    .update(users)
    .set({ role: user.role === 'admin' ? 'user' : 'admin' })
    .where(eq(users.id, user.id))
    .returning({ id: users.id, role: users.role })

  console.log(updatedUser)

  await updateUserSessionData(updatedUser, await cookies())
}
