import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const hashPassword = (v: string) => bcrypt.hash(v, 10)
export const comparePassword = (p: string, h: string) =>
    bcrypt.compare(p, h)

export const sha256 = (v: string) =>
    crypto.createHash('sha256').update(v).digest('hex')