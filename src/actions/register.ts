'use server'

import { LoginSchema, RegisterSchema } from "@/schemas"
import { revalidatePath, revalidateTag } from "next/cache"
import z from "zod"
import bcrypt from 'bcrypt'
import prisma from "@/lib/prisma"
import { getUserByEmail } from "@/services/user"


export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!"}
  }

  const {email, password, name} = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return {error: "Email already in use!"}
  }

  await prisma.user.create({
    data: {
      email, name, password: hashedPassword
    }
  })

  // TODO: send verification token email
  
  return { success: "User Created!"}
}