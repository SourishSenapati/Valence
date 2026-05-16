import { PrismaClient, Role, UomType, GoalStatus, Quarter, ProgressStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding...");

  // 1. Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const hrAdmin = await prisma.user.create({
    data: {
      name: "Sourish Senapati",
      email: "sourish@valence.com",
      role: Role.HR_ADMIN,
      department: "Corporate",
    },
  });

  const plantHead = await prisma.user.create({
    data: {
      name: "John Plant",
      email: "john@valence.com",
      role: Role.PLANT_HEAD,
      department: "Manufacturing",
    },
  });

  const shiftManager = await prisma.user.create({
    data: {
      name: "Sarah Manager",
      email: "sarah@valence.com",
      role: Role.SHIFT_MANAGER,
      department: "Operations",
      managerId: plantHead.id,
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: "Dave Employee",
      email: "dave@valence.com",
      role: Role.EMPLOYEE,
      department: "Operations",
      managerId: shiftManager.id,
    },
  });

  console.log("✅ Users created.");

  // 3. Create Goals for Employee
  const goal1 = await prisma.goal.create({
    data: {
      title: "Reduce Production Downtime",
      description: "Optimize machinery maintenance cycles to reduce unscheduled downtime.",
      thrustArea: "OPERATIONAL_EXCELLENCE",
      uomType: UomType.MIN,
      targetValue: 5.0, // 5% downtime
      weightage: 40,
      status: GoalStatus.APPROVED,
      employeeId: employee.id,
      lockedAt: new Date(),
    },
  });

  const goal2 = await prisma.goal.create({
    data: {
      title: "Zero Safety Incidents",
      description: "Maintain a perfect safety record throughout the fiscal year.",
      thrustArea: "SAFETY",
      uomType: UomType.ZERO,
      targetValue: 0,
      weightage: 30,
      status: GoalStatus.APPROVED,
      employeeId: employee.id,
      lockedAt: new Date(),
    },
  });

  const goal3 = await prisma.goal.create({
    data: {
      title: "New Product Line Integration",
      description: "Successfully integrate the X-series production line by Q3.",
      thrustArea: "GROWTH",
      uomType: UomType.TIMELINE,
      targetValue: 100,
      weightage: 30,
      status: GoalStatus.APPROVED,
      employeeId: employee.id,
      lockedAt: new Date(),
    },
  });

  console.log("✅ Goals created.");

  // 4. Create Check-ins for Q1 and Q2
  await prisma.checkIn.create({
    data: {
      goalId: goal1.id,
      quarter: Quarter.Q1,
      actualAchievement: 6.2,
      progressStatus: ProgressStatus.ON_TRACK,
      managerComment: "Good start, keep optimizing.",
    },
  });

  await prisma.checkIn.create({
    data: {
      goalId: goal1.id,
      quarter: Quarter.Q2,
      actualAchievement: 4.8,
      progressStatus: ProgressStatus.COMPLETED,
      managerComment: "Excellent reduction in downtime.",
    },
  });

  await prisma.checkIn.create({
    data: {
      goalId: goal2.id,
      quarter: Quarter.Q1,
      actualAchievement: 0,
      progressStatus: ProgressStatus.COMPLETED,
    },
  });

  console.log("✅ Check-ins created.");
  console.log("✨ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
