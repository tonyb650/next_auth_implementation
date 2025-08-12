import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'

const SettingsPage = async () => {
  const session = await auth()

  return (
    <div>{JSON.stringify(session)}
    <form onSubmit={async () => {
      'use server'
      console.log("Attempting SignOut")
      const response = await signOut({redirectTo: "/"})
      console.log(response)
    }}> 
      <Button type="submit">Sign Out</Button>
    </form>
    </div>

  )
}

export default SettingsPage