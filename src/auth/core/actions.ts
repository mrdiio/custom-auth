'use server'

import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { SignInFormData, SignUpFormData } from '@/types/auth.type'
import { eq } from 'drizzle-orm'
import { comparePassword, hashPassword } from './password-hasher'
import {
  createUserSession,
  removeUserFromSession,
  UserSession,
} from './session'
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

  await createUserSession(user as UserSession, await cookies())

  redirect('/')
}

export async function signIn(data: SignInFormData) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  })

  console.log('User found:', user)

  if (!user) {
    throw new Error('Invalid email')
  }

  if (!comparePassword(data.password, user.password!)) {
    throw new Error('Invalid password')
  }

  await createUserSession(user, await cookies())

  redirect('/')
}

export async function logOut() {
  await removeUserFromSession(await cookies())
  redirect('/')
}
