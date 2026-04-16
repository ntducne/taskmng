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

                    currentlyCoding: { $sum: { $cond: [{ 
                        $eq: ["$task_status", 0] 
                    }, 1, 0] } },

                    waitingForLocalTesting: { $sum: { $cond: [{ 
                        $eq: ["$task_status", 1] 
                    }, 1, 0] } },

                    waitingForDevelopTesting: { $sum: { $cond: [{ 
                        $eq: ["$task_status", 2] 
                    }, 1, 0] } },

                    waitingForProductionTesting: { $sum: { $cond: [{ 
                        $eq: ["$task_status", 3] 
                    }, 1, 0] } },

                    localTestingDone: { $sum: { $cond: [{ 
                        $gte: ["$task_status", 2] 
                    }, 1, 0] } },

                    developTestingDone: { $sum: { $cond: [{ 
                        $gte: ["$task_status", 3] 
                    }, 1, 0] } },

                    productionTestingDone: { $sum: { $cond: [{ 
                        $gte: ["$task_status", 4] 
                    }, 1, 0] } },
                },
            },
        ]);

        const result = stats[0] || {};

        return NextResponse.json({
            coding: result.currentlyCoding || 0,
            bugs: result.totalBugs || 0,
            waiting_test: {
                local: result.waitingForLocalTesting || 0,
                develop: result.waitingForDevelopTesting || 0,
                production: result.waitingForProductionTesting || 0,
            },
            testing: {
                local: result.localTestingDone || 0,
                develop: result.developTestingDone || 0,
                production: result.productionTestingDone || 0,
            },
            total: result.total || 0,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}