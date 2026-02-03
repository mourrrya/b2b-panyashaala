import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting shelf life update for dry extract variants...");

  try {
    // Update all variants where the associated product has category DRY_EXTRACT
    const result = await prisma.variant.updateMany({
      where: {
        product: {
          category: "DRY_EXTRACT",
        },
        shelfLife: null, // Only update variants that don't already have a shelf life set
      },
      data: {
        shelfLife: 3, // 3 years
      },
    });

    console.log(`Updated ${result.count} dry extract variants with 3-year shelf life.`);

    // Optional: Log the updated variants for verification
    const updatedVariants = await prisma.variant.findMany({
      where: {
        product: {
          category: "DRY_EXTRACT",
        },
        shelfLife: 3,
      },
      select: {
        id: true,
        variantName: true,
        shelfLife: true,
        product: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    });

    console.log("Updated variants:");
    updatedVariants.forEach((variant) => {
      console.log(`- ${variant.product.name} (${variant.variantName}): ${variant.shelfLife} years`);
    });
  } catch (error) {
    console.error("Error updating shelf life:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
