import { Elysia } from 'elysia'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
    CreateTaskSchema,
    UpdateTaskSchema,
    TaskParamsSchema,
    GetTasksQuerySchema
} from '../schemas/task.schema'
import { TaskRepository } from '../repositories/task.repository'
import { TaskService } from '../services/task.service'
import { TaskController } from '../controllers/task.controller'

const taskRepository = new TaskRepository()
const taskService = new TaskService(taskRepository)
const taskController = new TaskController(taskService)

export const taskRoute = new Elysia({ prefix: '/tasks' })
    .use(authMiddleware)
    .get('/', ({ query }) => TaskController.getAllTasks(query), {
        query: GetTasksQuerySchema
    })
    .get('/:task_id', ({ params }) => taskController.getTaskById(params.task_id), {
        params: TaskParamsSchema
    })
    .post('/', ({ body }) => taskController.createTask(body), {
        body: CreateTaskSchema
    })
    .put('/:task_id', ({ params, body }) => taskController.updateTask(params.task_id, body), {
        params: TaskParamsSchema,
        body: UpdateTaskSchema
    })
    .delete('/:task_id', ({ params }) => taskController.deleteTask(params.task_id), {
        params: TaskParamsSchema
    })