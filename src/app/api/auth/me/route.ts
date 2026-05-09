import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer "))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "") as {
      userId: string;
    };
    try {
      await connect();
    } catch (err: any) {
      return NextResponse.json(
        { message: err?.message || "DB error" },
        { status: 500 },
      );
    }
    const user = await User.findById(payload.userId).select("-password");
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
