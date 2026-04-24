import { AppError } from '../utils/app-error'
import { BlacklistModel } from '../models/blacklist.model'
import { sha256 } from '../utils/hash'

export const authMiddleware = async ({ jwt, headers } :any) => {
    let msg = 'Unauthorized';
    const throwError = (message?: string) => {
        throw new AppError(message || msg, 401)
    }
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) throwError(msg)
    const bearer = authHeader.split(' ')[1]
    if (!bearer) throwError(msg)
    const payload = await jwt.verify(bearer)
    if (!payload) throwError(msg)
    const black = await BlacklistModel.exists({
        token_hash: sha256(bearer)
    })
    if (black) throwError(msg)
}