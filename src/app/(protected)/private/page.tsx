import { getCurrentUser } from '@/auth/core/current-user'
import React from 'react'
import ToggleRoleButton from './toggle-role-button'

export default async function PrivatePage() {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true })
  return (
    <div className="flex flex-col gap-6">
      <span>Role: {currentUser.role}</span>
      <ToggleRoleButton />
    </div>
  )
}
