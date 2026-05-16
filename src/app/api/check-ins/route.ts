import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Quarter, ProgressStatus } from "@prisma/client";

const QUARTER_MONTH_MAPPING = {
  [Quarter.Q1]: [6], // July
  [Quarter.Q2]: [9], // October
  [Quarter.Q3]: [0], // January
  [Quarter.Q4]: [2, 3], // March, April
};

function isCheckInAllowed(quarter: Quarter) {
  const currentMonth = new Date().getMonth();
  const allowedMonths = QUARTER_MONTH_MAPPING[quarter];
  return allowedMonths.includes(currentMonth);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const goals = await db.goal.findMany({
      where: {
        employeeId: session.user.id,
        status: "APPROVED",
      },
      include: {
        checkIns: true,
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[CHECKINS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { goalId, quarter, actualAchievement, progressStatus } = await req.json();

    // 1. Strict Schedule Enforcement
    if (!isCheckInAllowed(quarter)) {
      return new NextResponse(
        JSON.stringify({ error: `Check-ins for ${quarter} are not active in the current cycle.` }), 
        { status: 403 }
      );
    }

    // 2. Validate Goal Ownership and Status
    const goal = await db.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal || goal.employeeId !== session.user.id || goal.status !== "APPROVED") {
      return new NextResponse("Invalid goal or access denied", { status: 403 });
    }

    // 3. Upsert Check-in
    const checkIn = await db.checkIn.upsert({
      where: {
        // Since we don't have a composite unique constraint on (goalId, quarter) in the schema,
        // we'll find existing or create. Wait, the schema didn't have a unique constraint.
        // Let's just find first.
        id: (await db.checkIn.findFirst({
          where: { goalId, quarter }
        }))?.id ?? "non-existent-id",
      },
      update: {
        actualAchievement,
        progressStatus,
        timestamp: new Date(),
      },
      create: {
        goalId,
        quarter,
        actualAchievement,
        progressStatus,
      },
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error("[CHECKINS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
