import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'
import { AppError } from '../utils/app-error'

export type JwtUserPayload = {
    sub: string
    task_id?: string
    role?: string
}

export const authMiddleware = new Elysia({ name: 'auth-middleware' })
    .use(bearer())
    .use(
        jwt({
            name: 'jwt',
            secret: env.JWT_SECRET
        })
    )
    .resolve(async ({ bearer, jwt }) => {
        if (!bearer) {
            throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
        }

        const payload = await jwt.verify(bearer)

        if (!payload) {
            throw new AppError('Invalid token', 401, 'INVALID_TOKEN')
        }

        return {
            user: payload as JwtUserPayload
        }
    })