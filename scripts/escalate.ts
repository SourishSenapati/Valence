import { PrismaClient, GoalStatus } from "@prisma/client";
import { subDays } from "date-fns";

const db = new PrismaClient();

async function escalate() {
  console.log("🔍 Scanning for SLA breaches in Pending Approvals...");

  const tenDaysAgo = subDays(new Date(), 10);

  // Find pending goals older than 10 days based on updatedAt
  const breachedGoals = await db.goal.findMany({
    where: {
      status: GoalStatus.PENDING,
      updatedAt: { lte: tenDaysAgo },
    } as any,
    include: { 
      employee: {
        include: { manager: true }
      }
    },
  });

  if (breachedGoals.length === 0) {
    console.log("✅ No SLA breaches detected. All pending goals are within the 10-day window.");
    return;
  }

  console.warn(`🔥 DETECTED ${breachedGoals.length} SLA BREACHES!`);

  breachedGoals.forEach((goal: any) => {
    const managerEmail = goal.employee.manager?.email || "UNASSIGNED";
    console.warn(`[ESCALATION] ALERT: Manager ${managerEmail} has breached the 10-day SLA for Goal ID: ${goal.id} (Employee: ${goal.employee.name}).`);
  });

  console.log("🚀 Escalation scan complete.");
}

escalate()
  .catch(e => {
    console.error("❌ Escalation Script Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
