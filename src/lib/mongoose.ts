import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Defer throwing — callers will check and surface errors per-request
}

export async function connect() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI not set");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export default mongoose;
