import "dotenv/config";
import { db } from "./src/lib/db/index.js";
import { users } from "./src/lib/db/schema.js";
import { eq } from "drizzle-orm";

async function createDemoPatient() {
  const existing = await db.select().from(users).where(eq(users.ayursutraId, "demo-pat-456"));
  if (existing.length === 0) {
    console.log("Creating demo patient...");
    await db.insert(users).values({
      name: "Demo Patient",
      email: "demopatient@example.com",
      role: "patient",
      ayursutraId: "demo-pat-456",
    });
    console.log("Created successfully!");
  } else {
    console.log("Demo patient already exists.");
  }
}
createDemoPatient();
