// middlewares/role.middleware.ts
import { AppError } from '../utils/app-error'

export const requireRole = (roles: string[]) => {
    return ({ user }: any) => {
        if (!roles.includes(user.role)) {
            throw new AppError('Forbidden', 403)
        }
    }
}