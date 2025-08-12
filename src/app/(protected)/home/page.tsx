import LogOutButton from '@/auth/components/LogOutButton'
import { getCurrentUser } from '@/auth/core/current-user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default async function Page() {
  const user = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: true,
  })

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex flex-col">
          <span>Name: {user.name}</span>
          <span>Role: {user.role}</span>
        </div>
      </CardContent>
    </Card>
  )
}
