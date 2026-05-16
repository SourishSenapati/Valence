import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "HR_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Progress Status by Department
    const usersWithGoals = await db.user.findMany({
      include: {
        goals: {
          include: {
            checkIns: true,
          }
        }
      }
    });

    const deptData: Record<string, any> = {};
    usersWithGoals.forEach((user: any) => {
      const dept = user.department || "Unknown";
      if (!deptData[dept]) {
        deptData[dept] = { department: dept, COMPLETED: 0, ON_TRACK: 0, NOT_STARTED: 0 };
      }
      
      user.goals.forEach((goal: any) => {
        const latestCheckIn = goal.checkIns[goal.checkIns.length - 1];
        const status = latestCheckIn?.progressStatus || "NOT_STARTED";
        deptData[dept][status]++;
      });
    });

    // 2. QoQ Average Achievement
    const checkIns = await db.checkIn.findMany();
    const qoqData = [
      { quarter: "Q1", avg: 0, count: 0 },
      { quarter: "Q2", avg: 0, count: 0 },
      { quarter: "Q3", avg: 0, count: 0 },
      { quarter: "Q4", avg: 0, count: 0 },
    ];

    checkIns.forEach((c: any) => {
      const q = qoqData.find(d => d.quarter === c.quarter);
      if (q) {
        q.avg += c.actualAchievement;
        q.count++;
      }
    });

    const finalQoq = qoqData.map(d => ({
      quarter: d.quarter,
      achievement: d.count > 0 ? d.avg / d.count : 0
    }));

    return NextResponse.json({ 
      deptDistribution: Object.values(deptData),
      qoqAchievement: finalQoq
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
