'use server'

import { RegisterSchema } from "@/schemas"
// import { revalidatePath, revalidateTag } from "next/cache"
import z from "zod"
import bcrypt from 'bcrypt'
import prisma from "@/lib/prisma"
import { getUserByEmail } from "@/services/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/email"


export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!"}
  }

  const {email, password, name} = validatedFields.data
  const existingUser = await getUserByEmail(email)
  
  if (existingUser) {
    return {error: "Email already in use!"}
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email, name, password: hashedPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: "Confirmation email sent!"}
}