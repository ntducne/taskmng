import { TaskRepository } from '../repositories/task.repository'
import { AppError } from '../utils/app-error'
import { ERROR_CODE } from '../constants/error-code'

import type {
    CreateTaskInput,
    UpdateTaskInput,
    GetTasksQueryInput
} from '../schemas/task.schema'

export class TaskService {
    constructor(private readonly taskRepository: TaskRepository) {}

    async getAllTasks(query: GetTasksQueryInput) {
        return this.taskRepository.findAll(query)
    }

    async getTaskById(taskId: string) {
        const task = await this.taskRepository.findByTaskId(taskId)

        if (!task) {
            throw new AppError('Không tìm thấy task', 404, ERROR_CODE.TASK_NOT_FOUND)
        }

        return task
    }

    async createTask(payload: CreateTaskInput) {
        const isExisted = await this.taskRepository.existsByTaskId(payload.task_id)

        if (isExisted) {
            throw new AppError(
                'Task ID đã tồn tại',
                409,
                ERROR_CODE.TASK_ID_ALREADY_EXISTS
            )
        }

        return this.taskRepository.create(payload)
    }

    async updateTask(currentTaskId: string, payload: UpdateTaskInput) {
        const existingTask = await this.taskRepository.findByTaskId(currentTaskId)

        if (!existingTask) {
            throw new AppError('Không tìm thấy task', 404, ERROR_CODE.TASK_NOT_FOUND)
        }

        if (payload.task_id && payload.task_id !== currentTaskId) {
            const duplicated = await this.taskRepository.existsByTaskId(
                payload.task_id
            )

            if (duplicated) {
                throw new AppError(
                    'Task ID đã tồn tại',
                    409,
                    ERROR_CODE.TASK_ID_ALREADY_EXISTS
                )
            }
        }

        const updatedTask = await this.taskRepository.updateByTaskId(
            currentTaskId,
            payload
        )

        return updatedTask
    }

    async deleteTask(taskId: string) {
        const existingTask = await this.taskRepository.findByTaskId(taskId)

        if (!existingTask) {
            throw new AppError('Không tìm thấy task', 404, ERROR_CODE.TASK_NOT_FOUND)
        }

        await this.taskRepository.deleteByTaskId(taskId)

        return true
    }
}