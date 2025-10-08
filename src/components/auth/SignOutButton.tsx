'use client'

import { signOut } from "next-auth/react"
import { PropsWithChildren } from "react"
// import { logout } from "@/actions/logout" <-- this would be the server action to use if you want to sign out programmatically somewhere

const SignOutButton = ({ children }: PropsWithChildren) => {
  const onClick = () => {
    // logout() <-- sign out via server action
    signOut()
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}

export default SignOutButton
