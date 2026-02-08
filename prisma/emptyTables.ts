import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../prisma/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function emptyTables() {
  console.log("🚨 DANGER: This will delete ALL products and variants!");
  console.log("⚠️  This action cannot be undone!");
  console.log("");

  // Safety check - require explicit confirmation
  const confirmText = "DELETE_ALL_PRODUCTS_AND_VARIANTS";
  console.log(`To proceed, you must set the environment variable:`);
  console.log(`CONFIRM_DELETION="${confirmText}"`);
  console.log("");

  if (process.env.CONFIRM_DELETION !== confirmText) {
    console.error("❌ Confirmation not provided. Aborting.");
    console.log("Set CONFIRM_DELETION environment variable to proceed.");
    process.exit(1);
  }

  console.log("🔍 Database connection check...");
  console.log(`📍 Database: ${process.env.DATABASE_URL?.substring(0, 30)}...\n`);

  try {
    // Get counts before deletion
    const [productCount, variantCount] = await Promise.all([
      prisma.product.count(),
      prisma.variant.count(),
    ]);

    console.log(`📊 Current data:`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Variants: ${variantCount}`);
    console.log("");

    if (productCount === 0 && variantCount === 0) {
      console.log("ℹ️  Tables are already empty. Nothing to delete.");
      return;
    }

    console.log("🗑️  Starting deletion process...\n");

    // Delete variants first (due to foreign key constraints)
    console.log("🗑️  Deleting variants...");
    const deletedVariants = await prisma.variant.deleteMany();
    console.log(`✅ Deleted ${deletedVariants.count} variants\n`);

    // Delete products
    console.log("🗑️  Deleting products...");
    const deletedProducts = await prisma.product.deleteMany();
    console.log(`✅ Deleted ${deletedProducts.count} products\n`);

    // Verify tables are empty
    const [finalProductCount, finalVariantCount] = await Promise.all([
      prisma.product.count(),
      prisma.variant.count(),
    ]);

    console.log("🔍 Verification:");
    console.log(`   Products remaining: ${finalProductCount}`);
    console.log(`   Variants remaining: ${finalVariantCount}`);

    if (finalProductCount === 0 && finalVariantCount === 0) {
      console.log("\n" + "=".repeat(50));
      console.log("🎉 TABLES SUCCESSFULLY EMPTIED");
      console.log("=".repeat(50));
      console.log(`📊 Products deleted: ${deletedProducts.count}`);
      console.log(`📊 Variants deleted: ${deletedVariants.count}`);
      console.log(`📊 Total records deleted: ${deletedProducts.count + deletedVariants.count}`);
      console.log("=".repeat(50));
    } else {
      console.error("❌ Verification failed! Some records may still exist.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error during deletion:", error);
    throw error;
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set!");
    process.exit(1);
  }

  await emptyTables();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
