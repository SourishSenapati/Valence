import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { stringify } from "csv-stringify/sync";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "HR_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employees = await db.user.findMany({
      where: { role: "EMPLOYEE" },
      include: {
        goals: {
          include: {
            checkIns: true,
          }
        },
        manager: {
          select: { name: true }
        }
      }
    });

    const reportData = employees.flatMap((emp: any) => {
      return emp.goals.map((goal: any) => {
        const q1 = goal.checkIns.find((c: any) => c.quarter === "Q1")?.actualAchievement ?? 0;
        const q2 = goal.checkIns.find((c: any) => c.quarter === "Q2")?.actualAchievement ?? 0;
        const q3 = goal.checkIns.find((c: any) => c.quarter === "Q3")?.actualAchievement ?? 0;
        const q4 = goal.checkIns.find((c: any) => c.quarter === "Q4")?.actualAchievement ?? 0;

        return {
          "Employee Name": emp.name,
          "Email": emp.email,
          "Department": emp.department,
          "Manager": emp.manager?.name ?? "N/A",
          "Goal Title": goal.title,
          "Weightage": goal.weightage,
          "Target": goal.targetValue,
          "Status": goal.status,
          "Q1 Actual": q1,
          "Q2 Actual": q2,
          "Q3 Actual": q3,
          "Q4 Actual": q4,
        };
      });
    });

    const csv = stringify(reportData, { header: true });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=Valence_Export_${new Date().toISOString().split('T')[0]}.csv`,
      },
    });
  } catch (error) {
    console.error("[EXPORT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
