import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as fs from "fs";
import Papa from "papaparse";
import * as path from "path";
import { PrismaClient } from "../prisma/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Format current date as DD-MM-YY_HH-mm (Windows-safe)
function getFormattedDateTime(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}_${hours}-${minutes}`;
}

// Convert array to CSV string using PapaParse
function arrayToCSV(data: any[]): string {
  if (data.length === 0) return "";

  return Papa.unparse(data, {
    header: true,
    skipEmptyLines: true,
  });
}

async function backupProductsAndVariants() {
  console.log("🚀 Starting database backup...\n");

  try {
    // Create backup folder with timestamp
    const timestamp = getFormattedDateTime();
    const backupFolder = path.join(process.cwd(), "backup", timestamp);

    // Create backup directory with full path
    fs.mkdirSync(backupFolder, { recursive: true });

    console.log(`📁 Backup folder created: ${backupFolder}\n`);

    // Fetch all products
    console.log("📥 Fetching products data...");
    const products = await prisma.product.findMany();

    console.log(`✅ Found ${products.length} products\n`);

    // Fetch all variants
    console.log("📥 Fetching variants data...");
    const variants = await prisma.variant.findMany();

    console.log(`✅ Found ${variants.length} variants\n`);

    // Save products to CSV
    console.log("💾 Saving products to CSV...");
    const productsCSV = arrayToCSV(products);
    const productsFilePath = path.join(backupFolder, "product-table-data.csv");
    fs.writeFileSync(productsFilePath, productsCSV, "utf-8");
    console.log(`✅ Products saved to: ${productsFilePath}`);

    // Save variants to CSV
    console.log("💾 Saving variants to CSV...");
    const variantsCSV = arrayToCSV(variants);
    const variantsFilePath = path.join(backupFolder, "variants-table-data.csv");
    fs.writeFileSync(variantsFilePath, variantsCSV, "utf-8");
    console.log(`✅ Variants saved to: ${variantsFilePath}`);

    // Create a summary file
    const summary = {
      timestamp: new Date().toISOString(),
      backupFolder: timestamp,
      productsCount: products.length,
      variantsCount: variants.length,
      files: ["product-table-data.csv", "variants-table-data.csv"],
    };

    const summaryFilePath = path.join(backupFolder, "backup-summary.json");
    fs.writeFileSync(summaryFilePath, JSON.stringify(summary, null, 2), "utf-8");
    console.log(`✅ Summary saved to: ${summaryFilePath}`);

    console.log("\n" + "=".repeat(50));
    console.log("🎉 BACKUP COMPLETE");
    console.log("=".repeat(50));
    console.log(`📁 Backup Location: ${backupFolder}`);
    console.log(`📊 Products: ${products.length}`);
    console.log(`📊 Variants: ${variants.length}`);
    console.log(`📄 Files Created: 3`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error during backup:", error);
    throw error;
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set!");
    process.exit(1);
  }

  console.log("🔍 Database connection check...");
  console.log(`📍 Database: ${process.env.DATABASE_URL.substring(0, 30)}...\n`);

  await backupProductsAndVariants();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
