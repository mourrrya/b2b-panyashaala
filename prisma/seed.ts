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

  // Seed product collections
  await seedProductCollections();

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

/**
 * Seed product collections for marketing categorization
 */
async function seedProductCollections() {
  console.log("Seeding product collections...");

  const collections = [
    { name: "hair & scalp health", description: "covers: hair, scalp" },
    { name: "skin & beauty care", description: "covers: skin, face, body" },
    {
      name: "aromatherapy & relaxation",
      description: "covers: aromatherapy, stress relief, relaxation",
    },
    { name: "pain & inflammation relief", description: "covers: muscles, joints, pain management" },
    { name: "digestive & gut health", description: "covers: digestion, stomach, gut" },
    { name: "respiratory & sinus support", description: "covers: breathing, sinus, congestion" },
    { name: "immunity & wellness", description: "covers: immunity, general wellness, vitality" },
    { name: "oral & dental care", description: "covers: teeth, gums, oral hygiene" },
    { name: "baby & child care", description: "covers: baby, child, gentle care" },
    { name: "pet care", description: "covers: pet grooming, pet health" },
    { name: "home & cleaning", description: "covers: household cleaning, disinfection, freshness" },
    {
      name: "industrial & manufacturing",
      description: "covers: bulk chemicals, industrial applications, raw materials",
    },
  ];

  for (const collection of collections) {
    const existing = await prisma.productCollection.findFirst({
      where: { name: collection.name },
    });

    if (!existing) {
      await prisma.productCollection.create({ data: collection });
      console.log(`  Created collection: ${collection.name}`);
    } else {
      // Update description if changed
      await prisma.productCollection.update({
        where: { id: existing.id },
        data: { description: collection.description },
      });
      console.log(`  Collection already exists (updated): ${collection.name}`);
    }
  }

  console.log("Product collections seeding completed.");
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
