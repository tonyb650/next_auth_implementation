"use server"

import prisma from "@/lib/prisma"
import { getUserByEmail } from "@/services/user"
import { getVerificationTokenByToken } from "@/services/verification-token"
import { success } from "zod"

export const newVerification = async (token: string) => {

  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: "Invalid token string!"}
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: "Verification token is expired"}
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser ) {
    return { error: "User does not exist with this email"}
  }

  await prisma.user.update({
    where: {id:existingUser.id}, 
    data: { emailVerified: new Date(), email: existingToken.email} // <-- needed for email update process
  })

  await prisma.verificationToken.delete({
    where: {id: existingToken.id}
  })

  return { success: "Email verified."}
}