import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL,
});

const prisma = new PrismaClient({ adapter });

async function checkData() {
  console.log("Checking database records...\n");

  const products = await prisma.product.count();
  console.log("Products:", products);

  const variants = await prisma.variant.count();
  console.log("Variants:", variants);

  const customers = await prisma.customer.count();
  console.log("Customers:", customers);

  const orders = await prisma.order.count();
  console.log("Orders:", orders);

  const batches = await prisma.batch.count();
  console.log("Batches:", batches);

  await prisma.$disconnect();
}

checkData().catch(console.error);
