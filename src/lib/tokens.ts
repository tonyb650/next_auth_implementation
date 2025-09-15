import crypto from "crypto"
import { getVerificationTokenByEmail } from "@/services/verification-token"
import { v4 } from "uuid"
import prisma from "./prisma"
import { getPasswordResetTokenByEmail } from "@/services/password-reset-token"
import { getTwoFactorTokenByEmail } from "@/services/two-factor-token"

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

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()

  const expires = new Date(new Date().getTime() +  15 * 60 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await prisma.twoFactorToken.delete({where: {id: existingToken.id}})
  }

  const twoFactorToken = await prisma.twoFactorToken.create({data:{token, email, expires}})

  return twoFactorToken
}