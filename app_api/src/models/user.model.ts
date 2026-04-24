import { Schema, model } from 'mongoose'

const userSchema = new Schema(
    {
        full_name: { type: String, required: true },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            unique: true
        },

        password: { type: String, required: true },

        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },

        status: { type: Number, default: 0 },

        address: String,
        description: String
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export const UserModel = model('User', userSchema)