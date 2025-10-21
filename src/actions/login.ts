'use server'

import { signIn } from "@/auth"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/email"
import prisma from "@/lib/prisma"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"
import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation"
import { getTwoFactorTokenByEmail } from "@/services/two-factor-token"
import { getUserByEmail } from "@/services/user"
import { AuthError } from "next-auth"
import z from "zod"
// import { revalidatePath, revalidateTag } from "next/cache"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!"}
  }

  const { email, password, code} = validatedFields.data
  console.log(email)
  console.log(password)
  console.log(code)

  const existingUser = await getUserByEmail(email)
  console.log(existingUser)
  
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials! (email doesn't exist)"}
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)

    await sendVerificationEmail(existingUser.email, verificationToken.token)
    
    return { success: "Verification email sent."}
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
      if (!twoFactorToken) {
        return { error: "Invalid Code!"}
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code."}
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()
      if (hasExpired) {
        return {error: "Code has expired."}
      }

      await prisma.twoFactorToken.delete({where: {id: twoFactorToken.id}})

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({where: {id: existingConfirmation.id}})
      }

      await prisma.twoFactorConfirmation.create({data: {userId: existingUser.id}})

    } else {

      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials"}
        default:
          return { error: "Something went wrong"}
      }
    }
    throw error // must re-throw error 
  }
  return { success: "completed"} // <-- I added this line
}
