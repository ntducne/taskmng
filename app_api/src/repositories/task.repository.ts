import { TaskModel } from '../models/task.model'
import type {
    CreateTaskInput,
    UpdateTaskInput,
    GetTasksQueryInput
} from '../schemas/task.schema'

export class TaskRepository {
    async findAll(query: GetTasksQueryInput) {
        const { page, limit, task_id } = query

        const filter: Record<string, any> = {}

        if (task_id) {
            filter.task_id = { $regex: task_id, $options: 'i' }
        }

        const skip = (page - 1) * limit

        const [items, total] = await Promise.all([
            TaskModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            TaskModel.countDocuments(filter)
        ])

        return {
            items,
            pagination: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit)
            }
        }
    }

    async findByTaskId(taskId: string) {
        return TaskModel.findOne({ task_id: taskId })
    }

    async existsByTaskId(taskId: string) {
        const task = await TaskModel.exists({ task_id: taskId })
        return !!task
    }

    async create(payload: CreateTaskInput) {
        return TaskModel.create({
            task_id: payload.task_id,
            task_status: payload.task_status ?? 0,
            deploy_date: payload.deploy_date ?? null,
            mgmt_code: payload.mgmt_code,
            bug: payload.bug ?? 0
        })
    }

    async updateByTaskId(taskId: string, payload: UpdateTaskInput) {
        return TaskModel.findOneAndUpdate(
            { task_id: taskId },
            { $set: payload },
            { new: true }
        )
    }

    async deleteByTaskId(taskId: string) {
        return TaskModel.findOneAndDelete({ task_id: taskId })
    }
}