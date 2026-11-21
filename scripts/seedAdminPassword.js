import { auth, mongoClient } from "../lib/auth.js";

async function main() {
  const db = mongoClient.db(process.env.DB_NAME || "pizzaHubDB");
  const userCol = db.collection("user");
  const accountCol = db.collection("account");
  const adminEmail = process.env.ADMIN_EMAIL || "mabdullah539629@gmail.com";
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) {
    console.error("ADMIN_PASSWORD environment variable is required.");
    process.exit(1);
  }

  const user = await userCol.findOne({ email: adminEmail });
  if (!user) {
    console.error("User not found!");
    process.exit(1);
  }

  // Ensure role is admin
  await userCol.updateOne(
    { _id: user._id },
    { $set: { role: "admin", isBlocked: false, banned: false } }
  );

  const ctx = await auth["$context"];
  const hashedPassword = await ctx.password.hash(adminPass);
  console.log("Hashed password length:", hashedPassword.length);

  // Check if credential account already exists
  const existingAcc = await accountCol.findOne({
    userId: user._id,
    providerId: "credential",
  });

  if (existingAcc) {
    await accountCol.updateOne(
      { _id: existingAcc._id },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    console.log("✅ Updated existing credential password for admin!");
  } else {
    await accountCol.insertOne({
      userId: user._id,
      accountId: user._id.toString(),
      providerId: "credential",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Created new credential account with password for admin!");
  }

  // Also verify sign in with auth.api.signInEmail
  try {
    const signInRes = await auth.api.signInEmail({
      body: {
        email: adminEmail,
        password: adminPass,
      },
    });
    console.log("🎉 Test Sign In Successful for admin:", {
      user: signInRes.user?.email,
      role: signInRes.user?.role,
    });
  } catch (err) {
    console.error("Test sign in error:", err);
  }

  process.exit(0);
}

main().catch(console.error);
