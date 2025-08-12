import LogOutButton from '@/auth/components/LogOutButton'
import { getCurrentUser } from '@/auth/core/current-user'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
  })

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-5">
      <div className="container max-w-lg sm:py-10 p-6 border rounded-md bg-white shadow-md motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
        <div className="max-w-xl mx-auto flex flex-1 justify-center flex-col gap-6">
          <h1 className="text-xl uppercase font-bold tracking-wider">
            Welcome
          </h1>

          {children}

          <div className="flex flex-row gap-4 justify-end">
            <Button asChild variant="outline">
              <Link href="/private">Private Page</Link>
            </Button>
            {user.role === 'admin' && (
              <Button asChild variant="outline">
                <Link href="/admin">Admin Page</Link>
              </Button>
            )}
            <LogOutButton />
          </div>
        </div>
      </div>
    </main>
  )
}
