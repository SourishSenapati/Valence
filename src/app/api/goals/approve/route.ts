import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { GoalStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["SHIFT_MANAGER", "PLANT_HEAD", "HR_ADMIN"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { goalId, newWeightage, newTarget } = await req.json();

    if (!goalId) {
      return new NextResponse("Missing goalId", { status: 400 });
    }

    // Execute atomic transaction for approval and audit logging
    const result = await db.$transaction(async (tx: any) => {
      const goal = await tx.goal.findUnique({
        where: { id: goalId },
        include: { employee: true },
      });

      if (!goal) throw new Error("Goal not found");
      
      // Ensure manager is authorized for this employee
      if (goal.employee.managerId !== session.user.id && session.user.role !== "HR_ADMIN") {
        throw new Error("Forbidden: Not the assigned manager");
      }

      const previousState = { ...goal };

      const updatedGoal = await tx.goal.update({
        where: { id: goalId },
        data: {
          status: GoalStatus.APPROVED,
          lockedAt: new Date(),
          weightage: newWeightage ?? goal.weightage,
          targetValue: newTarget ?? goal.targetValue,
        },
      });

      await tx.auditLog.create({
        data: {
          entityId: goalId,
          action: "MANAGER_APPROVAL_AND_LOCK",
          changedBy: session.user.email || session.user.id,
          previousState: JSON.parse(JSON.stringify(previousState)),
          newState: JSON.parse(JSON.stringify(updatedGoal)),
        },
      });

      return updatedGoal;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[GOAL_APPROVE_POST]", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
