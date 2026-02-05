const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Get credentials from command line arguments
// Usage: node scripts/create-admin.js <mongodb_uri> <admin_email> <admin_password> <admin_name>
const MONGODB_URI = process.argv[2];
const ADMIN_EMAIL = process.argv[3];
const ADMIN_PASSWORD = process.argv[4];
const ADMIN_NAME = process.argv[5] || "Admin";

// Validate inputs
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("\n❌ Missing required arguments!");
  console.log("\nUsage:");
  console.log(
    "  node scripts/create-admin.js <mongodb_uri> <admin_email> <admin_password> [admin_name]\n",
  );
  console.log("Example:");
  console.log(
    '  node scripts/create-admin.js "mongodb+srv://..." "admin@example.com" "SecurePass123" "Admin User"\n',
  );
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log(`Verified: ${existingAdmin.isEmailVerified}`);

      // Update password if needed
      const updatePassword = true; // Set to true if you want to update the password
      if (updatePassword) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        existingAdmin.password = hashedPassword;
        existingAdmin.isEmailVerified = true;
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("✅ Admin password and details updated!");
      }
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      // Create admin user
      const admin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        isEmailVerified: true, // Admin is pre-verified
        role: "admin",
      });

      await admin.save();
      console.log("✅ Admin user created successfully!");
      console.log("\n" + "=".repeat(50));
      console.log("Admin Credentials:");
      console.log("=".repeat(50));
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Name: ${ADMIN_NAME}`);
      console.log(`Role: admin`);
      console.log(`Email Verified: true`);
      console.log("=".repeat(50) + "\n");
    }

    // Verify the admin exists
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    if (admin && admin.role === "admin") {
      console.log("✅ Verification successful - Admin user is in database");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  }
}

createAdmin();
