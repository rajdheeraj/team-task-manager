const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("MONGO_URI:", uri); // 🔥 debug

    if (!uri) {
      throw new Error("MONGO_URI is undefined ❌");
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;