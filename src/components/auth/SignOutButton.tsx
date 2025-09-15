'use client'

import { PropsWithChildren } from "react"
import { logout } from "@/actions/logout"

const SignOutButton = ({ children }: PropsWithChildren) => {
  const onClick = () => {
    logout()
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}

export default SignOutButton
