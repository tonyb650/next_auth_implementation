"use server";

import prisma from "@/lib/prisma";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/services/password-reset-token";
import { getUserByEmail } from "@/services/user";
import bcrypt from "bcryptjs";
import z from "zod";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid password!" };
  }
  
  const { password } = validatedFields.data;

  const passwordResetToken = await getPasswordResetTokenByToken(token)

  if (!passwordResetToken) {
    return { error: "Invalid token!" };
  }

  if (new Date(passwordResetToken.expires) < new Date()) {
    return { error: "Expired token!" };
  }
  
  const existingUser = await getUserByEmail(passwordResetToken?.email);
  
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({ 
    where: {id: existingUser.id}, 
    data: {password: hashPassword}
  })

  await prisma.passwordResetToken.delete({
    where: {id: passwordResetToken.id}
  })

  return { success: "Password Updated!" };
};
