'use server'

import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { SignUpFormData } from '@/types/auth.type'
import { eq } from 'drizzle-orm'
import { hashPassword } from './password-hasher'
import { id } from 'zod/locales'
import { createUserSession } from './session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signUp(data: SignUpFormData) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  data.password = hashPassword(data.password)

  const [user] = await db.insert(users).values(data).returning({
    id: users.id,
    role: users.role,
  })

  await createUserSession(user, await cookies())

  redirect('/')
}
