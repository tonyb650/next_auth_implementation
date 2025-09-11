import { getVerificationTokenByEmail } from "@/services/verification-token"
import { v4 } from "uuid"
import prisma from "./prisma"
import { getPasswordResetTokenByEmail } from "@/services/password-reset-token"

export const generatePasswordResetToken = async (email: string) => {
  const token = v4()
  const expires = new Date(new Date().getTime() +  60 * 60 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await prisma.passwordResetToken.delete({where: {id: existingToken.id}})
  }

  const passwordResetToken = await prisma.passwordResetToken.create({data:{token, email, expires}})

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const token = v4()
  const expires = new Date(new Date().getTime() +  60 * 60 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await prisma.verificationToken.delete({where: {id: existingToken.id}})
  }

  const verificationToken = await prisma.verificationToken.create({data:{token, email, expires}})

  return verificationToken
}