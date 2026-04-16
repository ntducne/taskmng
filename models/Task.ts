import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema({
    task_id: { type: String, required: true, unique: true },
    task_status: { type: Number, default: 0 },
    deploy_date: { type: String, default: null },
    mgmt_code: { type: Number, required: true },
    bug: { type: Number, default: 0 },
}, { timestamps: true });

const Task = models.Task || model("Task", TaskSchema);
export default Task;