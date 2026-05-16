import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { GoalSheetSchema } from "@/lib/validations/goal";
import { validateGoalSheet } from "@/lib/engine";
import { GoalStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "EMPLOYEE") {
      return new NextResponse("Forbidden: Only employees can create goal sheets", { status: 403 });
    }

    const body = await req.json();
    // Support both direct array and { goals: [] } wrapper for flexibility
    const goalsArray = Array.isArray(body) ? body : body.goals;
    
    if (!goalsArray) {
      return new NextResponse("Missing goals array", { status: 400 });
    }

    // Engine Validation
    const engineResult = validateGoalSheet(goalsArray);
    if (!engineResult.isValid) {
      return new NextResponse(JSON.stringify({ errors: engineResult.errors }), { status: 400 });
    }

    // Atomic transaction for goal sheet creation
    const createdGoals = await db.$transaction(
      goalsArray.map((goal: any) => 
        db.goal.create({
          data: {
            title: goal.title,
            description: goal.description,
            thrustArea: goal.thrustArea,
            uomType: goal.uomType,
            targetValue: goal.targetValue,
            weightage: goal.weightage,
            employeeId: session.user.id,
            status: GoalStatus.PENDING,
          }
        })
      )
    );

    // Audit Log for the creation
    await db.auditLog.create({
      data: {
        entityId: session.user.id,
        action: "GOAL_SHEET_SUBMISSION",
        changedBy: session.user.id,
        newState: createdGoals as any,
      }
    });

    return NextResponse.json(createdGoals);
  } catch (error) {
    console.error("[GOALS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
