'use client'

// import { auth } from '@/auth'
import SignOutButton from '@/components/auth/SignOutButton'
import { Button } from '@/components/ui/button'
import useCurrentUser from '@/hooks/useCurrentUser'
// import { useSession } from 'next-auth/react' <-- import for 'client' useSession

const SettingsPage = () => {
  // const session = await auth() <-- This is how you get 'session' in server component
  // const session = useSession() <-- This is how you get 'session' in client component
  const user = useCurrentUser() // <-- This is our little helper hook

  return (
    <div className='bg-white p-10 rounded-xl'>


      <SignOutButton>
        <Button>
          Sign Out {user?.name}
        </Button>
      </SignOutButton>
    </div>

  )
}

export default SettingsPage