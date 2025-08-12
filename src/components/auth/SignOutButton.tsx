"use client"
import { Button } from '@/components/ui/button'
import { signOut } from '@/auth'

const SignOutButton = () => {
  return (
    <Button
      type="button"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  )
}

export default SignOutButton