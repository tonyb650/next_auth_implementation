import z from "zod";

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
