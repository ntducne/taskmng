import { toast } from "@heroui/react";
import axios from "axios";

const getErrorMessage = (err: any): string => {
    if (axios.isAxiosError(err) && err.response?.data) {
        if (err.response.data.error) {
            return err.response.data.error;
        }
        if (err.response.data.message) {
            return err.response.data.message;
        }
    }
    return err.message || "Đã có lỗi không xác định xảy ra";
};

export const fetchTasks = async (params: any = {}): Promise<any[]> => {
    try {
        const response = await axios.get('/api/tasks', { params });
        return response.data;
    } catch (err: any) {
        toast.danger(getErrorMessage(err));
        return [];
    }
};

export const fetchTaskById = async (id: string): Promise<any | null> => {
    try {
        const response = await axios.get(`/api/tasks/${id}`);
        return response.data;
    } catch (err: any) {
        toast.danger(getErrorMessage(err));
        return null;
    }
};

export const createTask = async (taskData: any): Promise<boolean> => {
    try {
        await axios.post('/api/tasks', taskData);
        toast.success(`Task "${taskData.task_id || 'Mới'}" created successfully`);
        return true;
    } catch (err: any) {
        toast.danger(getErrorMessage(err));
        return false;
    }
};

export const updateTask = async (id: string, taskData: any): Promise<boolean> => {
    try {
        await axios.put(`/api/tasks/${id}`, taskData);
        toast.success(`Task with id ${id} updated successfully`);
        return true;
    } catch (err: any) {
        toast.danger(getErrorMessage(err));
        return false;
    }
};

export const deleteTask = async (id: string): Promise<boolean> => {
    try {
        await axios.delete(`/api/tasks/${id}`);
        toast.success(`Task with id ${id} deleted successfully`);
        return true;
    } catch (err: any) {
        toast.danger(getErrorMessage(err));
        return false;
    }
};

export const fetchTaskAnalysis = async (): Promise<any> => {
    try {
        const response = await axios.get('/api/analysis');
        return response.data;
    } catch (err: any) {
        toast.danger(getErrorMessage(err));
        return null;
    }
}