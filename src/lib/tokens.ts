import { getVerificationTokenByEmail } from "@/services/verification-token"
import { v4 } from "uuid"
import prisma from "./prisma"


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