import { Elysia } from 'elysia'
import { z } from 'zod'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'

export const authRoute = new Elysia({ prefix: '/auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: env.JWT_SECRET
        })
    )
    .post(
        '/login',
        async ({ body, jwt }) => {
            // Demo hard-code
            if (body.username !== 'admin' || body.password !== '123456') {
                return {
                    success: false,
                    message: 'Sai tài khoản hoặc mật khẩu'
                }
            }

            const accessToken = await jwt.sign({
                sub: 'user_1',
                role: 'admin'
            })

            return {
                success: true,
                data: {
                    accessToken
                }
            }
        },
        {
            body: z.object({
                username: z.string(),
                password: z.string()
            })
        }
    )