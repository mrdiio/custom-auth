import LogOutButton from '@/auth/components/LogOutButton'
import { getCurrentUser } from '@/auth/core/current-user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default async function Home() {
  // const user = {
  //   id: '1',
  //   name: 'John Doe',
  //   role: 'admin',
  // }
  const user = await getCurrentUser({ withFullUser: true })

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-12 row-start-2">
        {user ? (
          <Card className="max-w-[500px] mt-4">
            <CardHeader>
              <CardTitle>User: {user.name}</CardTitle>
              <CardDescription>Role: {user.role}</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/private">Private Page</Link>
              </Button>
              {user.role === 'admin' && (
                <Button asChild variant="outline">
                  <Link href="/admin">Admin Page</Link>
                </Button>
              )}
              {/* <LogOutButton /> */}

              <LogOutButton />
            </CardFooter>
          </Card>
        ) : (
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
