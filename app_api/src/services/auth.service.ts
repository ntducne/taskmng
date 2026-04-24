import { UserModel } from '../models/user.model'
import { RefreshTokenModel } from '../models/refresh-token.model'
import { BlacklistModel } from '../models/blacklist.model'
import { hashPassword, comparePassword, sha256 } from '../utils/hash'
import { AppError } from '../utils/app-error'
import { env } from '../config/env'

export class AuthService {
    async register(data: any) {
        const exist = await UserModel.findOne({ email: data.email })
        if (exist) throw new AppError('Email exists', 409)

        const password = await hashPassword(data.password)

        return UserModel.create({ ...data, password })
    }

    async login(data: any, accessJwt: any, refreshJwt: any) {
        const user = await UserModel.findOne({ email: data.email })
        if (!user) throw new AppError('Invalid', 401)

        const ok = await comparePassword(data.password, user.password)
        if (!ok) throw new AppError('Invalid', 401)

        const access = await accessJwt.sign({
            sub: user._id,
            role: user.role,
            type: 'access'
        })

        const refresh = await refreshJwt.sign({
            sub: user._id,
            type: 'refresh'
        })

        await RefreshTokenModel.create({
            user_id: user._id,
            token_hash: sha256(refresh),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        return { access, refresh }
    }

    async logout(accessToken: string, refreshToken: string) {
        console.log('logout access hash:', sha256(accessToken))
        await BlacklistModel.create({
            token_hash: sha256(accessToken),
            expires_at: new Date(Date.now() + 15 * 60 * 1000)
        })

        await RefreshTokenModel.updateOne(
            { token_hash: sha256(refreshToken) },
            { revoked_at: new Date() }
        )

        return true
    }
}