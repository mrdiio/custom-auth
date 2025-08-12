'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { toggleRole } from './actions'

export default function ToggleRoleButton() {
  return <Button onClick={toggleRole}>Toggle Role</Button>
}
