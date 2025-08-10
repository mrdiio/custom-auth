import z from 'zod'

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const SignUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type SignInFormData = z.infer<typeof SignInSchema>
export type SignUpFormData = z.infer<typeof SignUpSchema>
