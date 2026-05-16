import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { GoalStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["SHIFT_MANAGER", "PLANT_HEAD", "HR_ADMIN"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch goals for employees reporting to this manager
    const goals = await db.goal.findMany({
      where: {
        status: GoalStatus.PENDING,
        employee: {
          managerId: session.user.id,
        },
      },
      include: {
        employee: {
          select: {
            name: true,
            email: true,
            department: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[APPROVALS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["SHIFT_MANAGER", "PLANT_HEAD", "HR_ADMIN"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { goalId, action, weightage, targetValue } = await req.json();

    if (!goalId || !action) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const goal = await db.goal.findUnique({
      where: { id: goalId },
      include: { employee: true },
    });

    if (!goal || goal.employee.managerId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const previousState = { ...goal };
    
    let updatedGoal;
    if (action === "APPROVE") {
      updatedGoal = await db.goal.update({
        where: { id: goalId },
        data: {
          status: GoalStatus.APPROVED,
          lockedAt: new Date(),
          weightage: weightage ?? goal.weightage,
          targetValue: targetValue ?? goal.targetValue,
        },
      });
    } else if (action === "REJECT") {
      updatedGoal = await db.goal.update({
        where: { id: goalId },
        data: { status: GoalStatus.REJECTED },
      });
    } else if (action === "UPDATE") {
      updatedGoal = await db.goal.update({
        where: { id: goalId },
        data: {
          weightage: weightage ?? goal.weightage,
          targetValue: targetValue ?? goal.targetValue,
        },
      });
    }

    // Audit Log entry
    await db.auditLog.create({
      data: {
        entityId: goalId,
        action: `GOAL_${action}`,
        changedBy: session.user.id,
        previousState: previousState as any,
        newState: updatedGoal as any,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("[APPROVALS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
