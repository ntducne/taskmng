import { Elysia } from 'elysia'
import { connectDB } from './config/db'
import { env } from './config/env'
import { AppError } from './utils/app-error'
import { authRoute } from './routes/auth.route'
import { taskRoute } from './routes/task.route'
import { cors } from '@elysiajs/cors'
import jwt from '@elysiajs/jwt'
import { logPlugin, Log } from './utils/logger'
import { authMiddleware } from './middlewares/auth.middleware'

await connectDB()

new Elysia({ prefix: '/api' })
    .use(logPlugin)
    .use(
        jwt({
            name: 'jwt',
            secret: env.JWT_SECRET || 'fallback-secret'
        })
    )
    .use(cors())
    .onRequest(({ request }) => {
        Log.info('Request ', { method: request.method, url: request.url, params: Object.fromEntries(new URL(request.url).searchParams) })
    })
    .onError(({ error, set }) => {
        if (error instanceof AppError) {
            set.status = error.statusCode
            return {
                success: false,
                message: error.message,
                code: error.code
            }
        }
        Log.error('Lỗi: ', { error: error instanceof Error ? error.message : String(error) })
        set.status = 500
        return {
            success: false,
            message: 'Internal Server Error'
        }
    })
    .use(authRoute)
    .guard({
        beforeHandle: async ({ jwt, headers }: any) => await authMiddleware({ jwt, headers })
    }, (app) => app
        .use(taskRoute)
    )
    .listen(env.PORT)

console.log(`🦊 Server running at http://127.0.0.1:${env.PORT}`)