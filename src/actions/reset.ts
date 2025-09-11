"use server";

import { sendPasswordResetEmail } from "@/lib/email";
import {  generatePasswordResetToken} from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/services/user";
import z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(
    existingUser.email
  );

  await sendPasswordResetEmail(existingUser.email, passwordResetToken.token);
  return { success: "Reset email sent!" };
};
