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
  const { name, email, password } = body;
  if (!name || !email || !password)
    return NextResponse.json(
      { message: "All fields are required" },
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

  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json(
      { message: "Email already in use" },
      { status: 409 },
    );

  const user = await User.create({ name, email, password });
  const token = signToken(user._id.toString());

  return NextResponse.json(
    { token, user: { id: user._id, name: user.name, email: user.email } },
    { status: 201 },
  );
}
