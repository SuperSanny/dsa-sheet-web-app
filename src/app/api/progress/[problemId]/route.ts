import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { getUserIdFromHeader } from "@/lib/auth";
import { Progress } from "@/models/Progress";
import { Problem } from "@/models/Problem";
import mongoose from "mongoose";

export async function PUT(req: Request) {
  const userId = getUserIdFromHeader(
    req.headers.get("authorization") || undefined,
  );
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parts = req.url.split("/");
  const problemId = parts[parts.length - 1];
  if (!mongoose.Types.ObjectId.isValid(problemId))
    return NextResponse.json(
      { message: "Invalid problem ID" },
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
  const problem = await Problem.findById(problemId);
  if (!problem)
    return NextResponse.json({ message: "Problem not found" }, { status: 404 });

  const body = await req.json();
  const completed = !!body.completed;

  const updated = await Progress.findOneAndUpdate(
    { userId, problemId },
    { completed, completedAt: completed ? new Date() : undefined },
    { upsert: true, new: true },
  );

  return NextResponse.json({ progress: updated });
}
