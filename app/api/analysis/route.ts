import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET() {
    try {
        await connectDB();

        const stats = await Task.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    totalBugs: { $sum: "$bug" },
                    waitingLocal: { $sum: { $cond: [{ $eq: ["$local_test", 0] }, 1, 0] } },
                    waitingDev: { $sum: { $cond: [{ $eq: ["$develop_test", 0] }, 1, 0] } },
                    waitingProd: { $sum: { $cond: [{ $eq: ["$production_test", 0] }, 1, 0] } },
                    doneLocal: { $sum: { $cond: [{ $eq: ["$local_test", 1] }, 1, 0] } },
                    doneDev: { $sum: { $cond: [{ $eq: ["$develop_test", 1] }, 1, 0] } },
                    doneProd: { $sum: { $cond: [{ $eq: ["$production_test", 1] }, 1, 0] } },
                    codingWaiting: { $sum: { $cond: [{ $eq: ["$coding", 0] }, 1, 0] } },
                },
            },
        ]);

        const result = stats[0] || {};

        return NextResponse.json({
            coding: result.codingWaiting || 0,
            bugs: result.totalBugs || 0,
            waiting_test: {
                local: result.waitingLocal || 0,
                develop: result.waitingDev || 0,
                production: result.waitingProd || 0,
            },
            testing: {
                local: result.doneLocal || 0,
                develop: result.doneDev || 0,
                production: result.doneProd || 0,
            },
            total: result.total || 0,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}