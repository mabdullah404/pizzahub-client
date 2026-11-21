import { auth, mongoClient } from "../lib/auth.js";

async function main() {
  const db = mongoClient.db(process.env.DB_NAME || "pizzaHubDB");
  const userCol = db.collection("user");
  const adminEmail = "mabdullah539629@gmail.com";
  const adminPass = "Mabdullah77@";

  console.log("Checking admin account for:", adminEmail);
  const existingUser = await userCol.findOne({ email: adminEmail });

  if (existingUser) {
    console.log("User exists with ID:", existingUser._id);
    await userCol.updateOne(
      { _id: existingUser._id },
      { $set: { role: "admin", isBlocked: false, banned: false } }
    );
    console.log("✅ Role verified and updated to admin!");
  } else {
    console.log("Signing up admin via Better Auth API...");
    try {
      await auth.api.signUpEmail({
        body: {
          name: "PizzaHub Admin",
          email: adminEmail,
          password: adminPass,
          role: "admin",
        },
      });
      await userCol.updateOne(
        { email: adminEmail },
        { $set: { role: "admin", isBlocked: false, banned: false } }
      );
      console.log("✅ Admin created with role: admin");
    } catch (err) {
      console.error("SignUp error:", err);
    }
  }

  const finalCheck = await userCol.findOne({ email: adminEmail });
  console.log("Final admin check in database:", {
    email: finalCheck?.email,
    role: finalCheck?.role,
    name: finalCheck?.name,
  });

  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
