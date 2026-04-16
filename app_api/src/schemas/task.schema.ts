import { z } from 'zod'

export const TaskSchema = z.object({
    task_id: z.string().min(1, 'Task ID không được để trống'),
    task_status: z.number().int().min(0).max(4).default(0),
    deploy_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deploy Date phải có dạng YYYY-MM-DD')
        .nullable(),
    mgmt_code: z.number().int().positive('Management Code phải là số dương'),
    bug: z.number().int().min(0, 'Số lượng bug không được âm').default(0)
})

export const CreateTaskSchema = TaskSchema

export const UpdateTaskSchema = TaskSchema.partial()

export const TaskParamsSchema = z.object({
    task_id: z.string().min(1, 'Task ID không được để trống')
})

export const GetTasksQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    task_id: z.string().optional()
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
export type GetTasksQueryInput = z.infer<typeof GetTasksQuerySchema>