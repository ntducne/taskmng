import type {
    CreateTaskInput,
    GetTasksQueryInput,
    UpdateTaskInput
} from '../schemas/task.schema'
import { TaskService } from '../services/task.service'

export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    getAllTasks = async (query: GetTasksQueryInput) => {
        const result = await this.taskService.getAllTasks(query)

        return {
            success: true,
            data: result.items,
            pagination: result.pagination
        }
    }

    getTaskById = async (taskId: string) => {
        const task = await this.taskService.getTaskById(taskId)

        return {
            success: true,
            data: task
        }
    }

    createTask = async (body: CreateTaskInput) => {
        const task = await this.taskService.createTask(body)

        return {
            success: true,
            message: 'Tạo task thành công',
            data: task
        }
    }

    updateTask = async (taskId: string, body: UpdateTaskInput) => {
        const task = await this.taskService.updateTask(taskId, body)

        return {
            success: true,
            message: 'Cập nhật task thành công',
            data: task
        }
    }

    deleteTask = async (taskId: string) => {
        await this.taskService.deleteTask(taskId)

        return {
            success: true,
            message: 'Xóa task thành công'
        }
    }
}