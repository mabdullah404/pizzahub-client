import { auth, mongoClient } from "../lib/auth.js";

async function seedDefaultUsers() {
  console.log("🌱 Starting PizzaHub default users seeding...");
  const db = mongoClient.db(process.env.DB_NAME || "pizzaHubDB");
  const usersCollection = db.collection("user");

  const accountsToSeed = [
    {
      name: "PizzaHub Super Admin",
      email: "admin@pizzahub.com",
      password: "AdminPassword123",
      role: "admin",
      businessName: "",
    },
    {
      name: "Mario Rossi",
      email: "vendor@pizzahub.com",
      password: "VendorPassword123",
      role: "vendor",
      businessName: "Bella Napoli Trattoria",
    },
    {
      name: "Giovanni Customer",
      email: "customer@pizzahub.com",
      password: "CustomerPassword123",
      role: "customer",
      businessName: "",
    },
  ];

  for (const account of accountsToSeed) {
    try {
      const existing = await usersCollection.findOne({ email: account.email });
      if (existing) {
        // Ensure role is explicitly set
        await usersCollection.updateOne(
          { _id: existing._id },
          { $set: { role: account.role, businessName: account.businessName } }
        );
        console.log(`ℹ️ User [${account.email}] already exists. Verified role: ${account.role}`);
      } else {
        await auth.api.signUpEmail({
          body: {
            name: account.name,
            email: account.email,
            password: account.password,
            role: account.role,
            businessName: account.businessName,
          },
        });
        // Force update role to ensure Better Auth didn't default it to customer for admin
        await usersCollection.updateOne(
          { email: account.email },
          { $set: { role: account.role, businessName: account.businessName } }
        );
        console.log(`✅ Created ${account.role.toUpperCase()}: ${account.email}`);
      }
    } catch (err) {
      console.warn(`⚠️ Notice for ${account.email}:`, err.message);
    }
  }

  console.log("🌱 Default users verification complete!");
  process.exit(0);
}

seedDefaultUsers().catch((err) => {
  console.error("❌ Seed users failed:", err);
  process.exit(1);
});
