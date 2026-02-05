// Run this script to clear old verification tokens and reset the schema
// Usage: MONGODB_URI="your_uri" node scripts/clear-tokens.js

const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://nnu08821_db_user:BX7SNQaDAZkVDoTt@cluster0.tnujdhv.mongodb.net/?retryWrites=true&w=majority";

async function clearTokens() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    // Drop the entire collection to clear old schema
    console.log("Dropping VerificationToken collection...");
    try {
      await mongoose.connection.db.dropCollection("verificationtokens");
      console.log("✅ Collection dropped successfully");
    } catch (err) {
      if (err.message.includes("ns not found")) {
        console.log("Collection doesn't exist yet - that's okay!");
      } else {
        throw err;
      }
    }

    console.log("\n✅ Done! Restart your server now.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

clearTokens();
