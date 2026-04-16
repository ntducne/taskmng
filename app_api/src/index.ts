import { Elysia } from 'elysia'
import { connectDB } from './config/db'
import { env } from './config/env'
import { AppError } from './utils/app-error'
import { authRoute } from './routes/auth.route'
import { taskRoute } from './routes/task.route'

await connectDB()

const app = new Elysia({ prefix: '/api' })
    .onError(({ error, set }) => {
        if (error instanceof AppError) {
            set.status = error.statusCode

            return {
                success: false,
                message: error.message,
                code: error.code
            }
        }

        console.error(error)
        set.status = 500

        return {
            success: false,
            message: 'Internal Server Error'
        }
    })
    .use(authRoute)
    .use(taskRoute)
    .listen(env.PORT)

console.log(`🦊 Server running at http://127.0.0.1:${env.PORT}`)