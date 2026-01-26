import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seeding...");

  // Seed internal users (allowlist)
  await seedInternalUsers();

  console.log("Seeding finished.");
}

/**
 * Seed initial internal users for the allowlist
 * Modify the emails below to match your team's Gmail addresses
 */
async function seedInternalUsers() {
  console.log("Seeding internal users...");

  const internalUsers = [
    {
      email: "mourrrya@gmail.com",
      role: "SUPER_ADMIN" as const,
      permissions: ["all"],
      fullName: "System Administrator",
      department: "IT",
    },
    // Add more users as needed:
    // {
    //   email: "manager@gmail.com",
    //   role: "MANAGER" as const,
    //   permissions: ["inventory", "orders", "suppliers", "reports"],
    //   fullName: "Operations Manager",
    //   department: "Operations",
    // },
    // {
    //   email: "user@gmail.com",
    //   role: "USER" as const,
    //   permissions: ["inventory", "orders"],
    //   fullName: "Warehouse Staff",
    //   department: "Warehouse",
    // },
  ];

  for (const userData of internalUsers) {
    const existing = await prisma.internalUser.findUnique({
      where: { email: userData.email },
    });

    if (!existing) {
      await prisma.internalUser.create({
        data: {
          ...userData,
          status: "ACTIVE",
        },
      });
      console.log(`  Created internal user: ${userData.email}`);
    } else {
      console.log(`  Internal user already exists: ${userData.email}`);
    }
  }

  console.log("Internal users seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
