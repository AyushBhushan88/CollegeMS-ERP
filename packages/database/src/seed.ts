import { PrismaClient, UserRole, Category } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Roles and Permissions
  console.log('Seeding roles and permissions...');
  const roles = Object.values(UserRole);
  for (const roleName of roles) {
    let permissions: string[] = [];

    switch (roleName) {
      case UserRole.SUPER_ADMIN:
        permissions = ['*'];
        break;
      case UserRole.COLLEGE_ADMIN:
        permissions = [
          'user:read',
          'user:write',
          'user:delete',
          'student:read',
          'student:write',
          'student:delete',
          'program:read',
          'program:write',
          'program:delete',
          'finance:read',
          'finance:write',
          'finance:delete',
          'report:read',
        ];
        break;
      case UserRole.STUDENT:
        permissions = [
          'student:read:self',
          'finance:read:self',
          'document:read:self',
          'document:write:self',
        ];
        break;
      case UserRole.FACULTY:
        permissions = ['student:read', 'attendance:write', 'marks:write'];
        break;
      case UserRole.FINANCE_STAFF:
        permissions = ['finance:read', 'finance:write', 'transaction:read'];
        break;
      default:
        permissions = [`${roleName.toLowerCase()}:read`];
    }

    await prisma.role.upsert({
      where: { name: roleName },
      update: { permissions },
      create: { name: roleName, permissions },
    });
  }

  // 2. Create Super Admin
  console.log('Seeding super admin...');
  const superAdminEmail = 'admin@campuscore.edu';
  // Use a simple SHA256 for seed. In production, this would be Argon2.
  const passwordHash = crypto.createHash('sha256').update('Admin@123').digest('hex');

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });

  // 3. Seed Programs and Branches
  console.log('Seeding programs and branches...');
  const btech = await prisma.program.upsert({
    where: { code: 'BTECH' },
    update: {},
    create: {
      name: 'Bachelor of Technology',
      code: 'BTECH',
      description: 'Undergraduate engineering program',
    },
  });

  await prisma.program.upsert({
    where: { code: 'MCA' },
    update: {},
    create: {
      name: 'Master of Computer Applications',
      code: 'MCA',
      description: 'Postgraduate computer applications program',
    },
  });

  await prisma.branch.upsert({
    where: { code: 'CSE' },
    update: {},
    create: {
      name: 'Computer Science and Engineering',
      code: 'CSE',
      programId: btech.id,
    },
  });

  await prisma.branch.upsert({
    where: { code: 'ME' },
    update: {},
    create: {
      name: 'Mechanical Engineering',
      code: 'ME',
      programId: btech.id,
    },
  });

  // 4. Seed Fee Structure
  console.log('Seeding sample fee structure...');
  await prisma.feeStructure.upsert({
    where: {
      programId_batchYear_category_academicYear_semester: {
        programId: btech.id,
        batchYear: 2024,
        category: Category.GENERAL,
        academicYear: '2024-25',
        semester: 1,
      },
    },
    update: {},
    create: {
      programId: btech.id,
      batchYear: 2024,
      category: Category.GENERAL,
      academicYear: '2024-25',
      semester: 1,
      feeHeads: [
        { headName: 'Tuition Fee', amount: 50000, isMandatory: true },
        { headName: 'Library Fee', amount: 5000, isMandatory: true },
        { headName: 'Development Fee', amount: 10000, isMandatory: true },
      ],
      totalAmount: 65000,
      dueDate: new Date('2024-08-31'),
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
