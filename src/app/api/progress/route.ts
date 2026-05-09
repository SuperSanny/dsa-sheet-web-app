import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { getUserIdFromHeader } from "@/lib/auth";
import { Progress } from "@/models/Progress";

export async function GET(req: Request) {
  const userId = getUserIdFromHeader(
    req.headers.get("authorization") || undefined,
  );
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await connect();
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "DB error" },
      { status: 500 },
    );
  }
  const progress = await Progress.find({ userId, completed: true });
  const completedIds = progress.map((p) => p.problemId.toString());
  return NextResponse.json({ completedIds });
}
