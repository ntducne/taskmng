import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { TaskSchema } from "@/schemas/taskSchema";

export async function GET(
    req: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params; 
        const task = await Task.findOne({ task_id: id });
        if (!task) {
            return NextResponse.json(
                { error: `Không tìm thấy thông tin cho Task ID: ${id}` }, 
                { status: 404 }
            );
        }
        return NextResponse.json(task);
    } catch (error: any) {
        return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
    }
}

export async function PUT(
    req: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params; 
        const body = await req.json();
        const validation = TaskSchema.partial().safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ errors: validation.error.format() }, { status: 400 });
        }
        const newTaskId = validation.data.task_id;
        if (newTaskId && newTaskId !== id) {
            const isDuplicate = await Task.findOne({ task_id: newTaskId });
            if (isDuplicate) {
                return NextResponse.json(
                    { error: `Không thể đổi tên. Task ID '${newTaskId}' đã thuộc về một công việc khác!` }, 
                    { status: 409 }
                );
            }
        }
        const updatedTask = await Task.findOneAndUpdate(
            { task_id: id },
            validation.data,
            { new: true } 
        );
        if (!updatedTask) {
            return NextResponse.json({ error: "Không tìm thấy Task để cập nhật" }, { status: 404 });
        }
        return NextResponse.json(updatedTask);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Task ID đã tồn tại!" }, { status: 409 });
        }
        return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const existingTask = await Task.findOne({ task_id: id });
        if (!existingTask) {
            return NextResponse.json(
                { error: `Không thể xóa. Task ID ${id} không tồn tại hoặc đã bị xóa trước đó.` }, 
                { status: 404 }
            );
        }
        await Task.findOneAndDelete({ task_id: id });
        return NextResponse.json({ message: "Xóa thành công" });
    } catch (error: any) {
        return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
    }
}