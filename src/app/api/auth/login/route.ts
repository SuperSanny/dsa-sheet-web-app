import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "", {
    expiresIn: "7d",
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password)
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 },
    );

  try {
    await connect();
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "DB error" },
      { status: 500 },
    );
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const token = signToken(user._id.toString());
  return NextResponse.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
}
