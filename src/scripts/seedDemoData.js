
import "dotenv/config";
import mongoose from "mongoose";
import Customer from "../models/customer.model.js";

const demoCustomers = [
  { name: "Aarav", phone: "demo_001" },
  { name: "Priya", phone: "demo_002" },
  { name: "Rahul", phone: "demo_003" },
  { name: "Ananya", phone: "demo_004" },
  { name: "Arjun", phone: "demo_005" },
];

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const customer of demoCustomers) {
      await Customer.updateOne(
        { phone: customer.phone },
        { $setOnInsert: customer },
        { upsert: true }
      );
    }

    console.log("Demo customers seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

await seedDemoData();
