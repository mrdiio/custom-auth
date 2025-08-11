'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { logOut } from '../core/actions'

export default function LogOutButton() {
  return (
    <Button variant="destructive" onClick={async () => await logOut()}>
      Log Out
    </Button>
  )
}
