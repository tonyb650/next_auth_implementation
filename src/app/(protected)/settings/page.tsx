import { auth } from '@/auth'
import SignOutButton from '@/components/auth/SignOutButton'

const SettingsPage = async () => {
  const session = await auth()

  return (
    <div>
      {JSON.stringify(session)}
      {/* <form onSubmit={async () => {
        'use server'
        console.log("Attempting SignOut")
        const response = await signOut({redirectTo: "/auth/login"})
        console.log(response)
      }}> 
        <Button type="submit">Sign Out</Button>
      </form> */}
      <SignOutButton>
        button2
      </SignOutButton>
    </div>

  )
}

export default SettingsPage