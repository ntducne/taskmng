import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27019/project_management";

if (!MONGODB_URI) {
    throw new Error("Vui lòng định nghĩa biến MONGODB_URI trong file .env.local");
}

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        await mongoose.connect(MONGODB_URI);
        console.log("Kết nối MongoDB thành công");
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error);
    }
};