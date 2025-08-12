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
import { redirect } from 'next/navigation'

export default async function Home() {
  // const user = {
  //   id: '1',
  //   name: 'John Doe',
  //   role: 'admin',
  // }
  const user = await getCurrentUser({ withFullUser: true })

  if (user) redirect('/home')

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-12 row-start-2">
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
