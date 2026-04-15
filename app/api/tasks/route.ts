import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { TaskSchema } from "@/schemas/taskSchema";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const validation = TaskSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ", errors: validation.error.format() }, 
                { status: 400 }
            );
        }
        const existingTask = await Task.findOne({ task_id: validation.data.task_id });
        if (existingTask) {
            return NextResponse.json(
                { error: `Task ID '${validation.data.task_id}' đã tồn tại trong hệ thống!` }, 
                { status: 409 }
            );
        }
        const newTask = await Task.create(validation.data);
        return NextResponse.json(newTask, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Task ID đã tồn tại (Lỗi từ Database)!" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const searchTaskId = searchParams.get("search");
        let query: any = {};
        if (searchTaskId) {
            query.task_id = { $regex: searchTaskId, $options: "i" };
        }
        const tasks = await Task.find(query).sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (error: any) {
        return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
    }
}