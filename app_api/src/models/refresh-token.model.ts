import { Schema, model } from 'mongoose'

const schema = new Schema({
    user_id: String,
    token_hash: { type: String, unique: true },
    expires_at: Date,
    revoked_at: Date
})

export const RefreshTokenModel = model('RefreshToken', schema)