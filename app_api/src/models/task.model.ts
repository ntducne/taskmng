import { Schema, model, type InferSchemaType } from 'mongoose'

const taskMongooseSchema = new Schema(
    {
        task_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        task_status: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 4
        },
        deploy_date: {
            type: String,
            default: null
        },
        mgmt_code: {
            type: Number,
            required: true
        },
        bug: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export type TaskDocument = InferSchemaType<typeof taskMongooseSchema>

export const TaskModel = model('Task', taskMongooseSchema)