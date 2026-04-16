import { z } from "zod";

export const TaskSchema = z.object({
    task_id: z.string().min(1, "Task ID không được để trống"),
    task_status: z.number().min(0).max(4).default(0),
    deploy_date: z.string().nullable().or(z.string().length(10)),
    mgmt_code: z.number().int().positive("Management Code phải là số dương"),
    bug: z.number().int().min(0, "Số lượng bug không được âm").default(0),
});

export type TaskInput = z.infer<typeof TaskSchema>;