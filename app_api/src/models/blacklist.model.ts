import { Schema, model } from 'mongoose'

const schema = new Schema({
    token_hash: { type: String, unique: true },
    expires_at: Date
})

export const BlacklistModel = model('Blacklist', schema)