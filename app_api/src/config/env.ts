// src/config/env.ts
import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    MONGODB_URI: z.string().min(1, 'MONGO_URI không được để trống'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET không được để trống'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error('❌ Invalid environment variables:')
    console.error(_env.error.format())
    process.exit(1)
}

export const env = _env.data