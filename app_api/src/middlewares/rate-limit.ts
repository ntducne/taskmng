// middlewares/rate-limit.ts
import { AppError } from '../utils/app-error'

const store = new Map()

export const rateLimit = (key: string) => {
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || entry.exp < now) {
        store.set(key, { count: 1, exp: now + 60000 })
        return
    }

    if (entry.count > 5) {
        throw new AppError('Too many attempts', 429)
    }

    entry.count++
}