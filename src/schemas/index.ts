import { UserRole } from "@/generated/prisma";
import z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
.refine((data) => {
  if(data.password && !data.newPassword) {
    return false
  }
  if(data.newPassword && !data.password) {
    return false
  }

  return true
}, {
  message: "New password is required!", 
  path: ["newPassword"]
})

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
})

export const ResetSchema = z.object({
  email: z.email({message: "Email is required"}),
})

export const LoginSchema = z.object({
  email: z.email({message: "Email is required"}),
  password: z.string().min(1, {message: "Password is required"}),
  code: z.string().optional()
})

export const RegisterSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  email: z.email({message: "Email is required"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
})
