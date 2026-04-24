import { z } from 'zod'

export const ROLE = {
    ADMIN: 'admin',
    USER: 'user'
} as const

export const UserSchema = z.object({
    full_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().regex(/^(0|\+84)[0-9]{9}$/),
    password: z.string().min(6),

    role: z.nativeEnum(ROLE),
    status: z.number().int().min(0).max(4).default(0),

    address: z.string().optional(),
    description: z.string().optional()
})

export const CreateUserSchema = UserSchema

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})