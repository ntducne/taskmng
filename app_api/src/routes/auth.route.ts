// routes/auth.route.ts
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'
import { AuthService } from '../services/auth.service'
import { rateLimit } from '../middlewares/rate-limit'
import bearer from '@elysiajs/bearer'

const service = new AuthService()

export const authRoute = new Elysia({ prefix: '/auth' })
    .use(jwt({ name: 'accessJwt', secret: env.JWT_SECRET }))
    .use(jwt({ name: 'refreshJwt', secret: env.JWT_REFRESH_SECRET }))
    .use(bearer())
    .post('/register', ({ body }) => service.register(body))
    .post('/login', ({ body, accessJwt, refreshJwt, request }) => {
        rateLimit(request.headers.get('x-forwarded-for') || 'ip')
        return service.login(body, accessJwt, refreshJwt)
    })
    .post('/logout', ({ bearer, body }: any) =>
        service.logout(bearer, body.refresh_token)
    )