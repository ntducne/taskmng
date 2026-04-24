import { z } from 'zod'
import 'dotenv/config'

const schema = z.object({
    PORT: z.coerce.number().default(3000),
    MONGO_URI: z.string(),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string()
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
    console.error(parsed.error.format())
    process.exit(1)
}

export const env = parsed.data