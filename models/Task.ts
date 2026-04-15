import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema({
    task_id: { type: String, required: true, unique: true },
    coding: { type: Number, default: 0 },
    local_test: { type: Number, default: 0 },
    develop_test: { type: Number, default: 0 },
    production_test: { type: Number, default: 0 },
    deploy_date: { type: String, default: null },
    mgmt_code: { type: Number, required: true },
    bug: { type: Number, default: 0 },
}, { timestamps: true });

const Task = models.Task || model("Task", TaskSchema);
export default Task;