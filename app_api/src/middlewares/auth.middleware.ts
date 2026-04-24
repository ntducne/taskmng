import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'
import { env } from '../config/env'
import { AppError } from '../utils/app-error'
import { UserModel } from '../models/user.model'
import { BlacklistModel } from '../models/blacklist.model'
import { sha256 } from '../utils/hash'

const authMiddleware = (app: Elysia) => {
    app
        .use(bearer())
        .use(jwt({ name: 'jwt', secret: env.JWT_SECRET }))
        .resolve(async ({ bearer, jwt }) => {
            if (!bearer) throw new AppError('Unauthorized', 401)
            const payload = await jwt.verify(bearer)
            if (!payload) throw new AppError('Invalid token', 401)
            const black = await BlacklistModel.exists({
                token_hash: sha256(bearer)
            })
            if (black) throw new AppError('Token revoked', 401)
            const user = await UserModel.findById(payload.sub)
            if (!user) throw new AppError('User not found', 401)
            return {
                user,
                accessToken: bearer
            }
        })
}

export { authMiddleware };  