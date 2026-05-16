import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create HR Admin
  const hrAdmin = await prisma.user.upsert({
    where: { email: 'hr.admin@valence.com' },
    update: {},
    create: {
      name: 'HR Admin',
      email: 'hr.admin@valence.com',
      role: Role.HR_ADMIN,
      department: 'Human Resources',
    },
  });
  console.log(`Created HR Admin: ${hrAdmin.name}`);

  // Create Plant Head
  const plantHead = await prisma.user.upsert({
    where: { email: 'plant.head@valence.com' },
    update: {},
    create: {
      name: 'Plant Head',
      email: 'plant.head@valence.com',
      role: Role.PLANT_HEAD,
      department: 'Operations',
    },
  });
  console.log(`Created Plant Head: ${plantHead.name}`);

  // Create Shift Managers
  const shiftManager1 = await prisma.user.upsert({
    where: { email: 'shift.manager1@valence.com' },
    update: { managerId: plantHead.id },
    create: {
      name: 'Shift Manager 1',
      email: 'shift.manager1@valence.com',
      role: Role.SHIFT_MANAGER,
      department: 'Operations',
      managerId: plantHead.id,
    },
  });
  console.log(`Created Shift Manager 1: ${shiftManager1.name}`);

  const shiftManager2 = await prisma.user.upsert({
    where: { email: 'shift.manager2@valence.com' },
    update: { managerId: plantHead.id },
    create: {
      name: 'Shift Manager 2',
      email: 'shift.manager2@valence.com',
      role: Role.SHIFT_MANAGER,
      department: 'Operations',
      managerId: plantHead.id,
    },
  });
  console.log(`Created Shift Manager 2: ${shiftManager2.name}`);

  // Create Employees reporting to Shift Manager 1
  const employee1 = await prisma.user.upsert({
    where: { email: 'employee1@valence.com' },
    update: { managerId: shiftManager1.id },
    create: {
      name: 'Employee 1',
      email: 'employee1@valence.com',
      role: Role.EMPLOYEE,
      department: 'Operations',
      managerId: shiftManager1.id,
    },
  });
  console.log(`Created Employee 1: ${employee1.name}`);

  const employee2 = await prisma.user.upsert({
    where: { email: 'employee2@valence.com' },
    update: { managerId: shiftManager1.id },
    create: {
      name: 'Employee 2',
      email: 'employee2@valence.com',
      role: Role.EMPLOYEE,
      department: 'Operations',
      managerId: shiftManager1.id,
    },
  });
  console.log(`Created Employee 2: ${employee2.name}`);

  // Create Employees reporting to Shift Manager 2
  const employee3 = await prisma.user.upsert({
    where: { email: 'employee3@valence.com' },
    update: { managerId: shiftManager2.id },
    create: {
      name: 'Employee 3',
      email: 'employee3@valence.com',
      role: Role.EMPLOYEE,
      department: 'Operations',
      managerId: shiftManager2.id,
    },
  });
  console.log(`Created Employee 3: ${employee3.name}`);

  const employee4 = await prisma.user.upsert({
    where: { email: 'employee4@valence.com' },
    update: { managerId: shiftManager2.id },
    create: {
      name: 'Employee 4',
      email: 'employee4@valence.com',
      role: Role.EMPLOYEE,
      department: 'Operations',
      managerId: shiftManager2.id,
    },
  });
  console.log(`Created Employee 4: ${employee4.name}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
