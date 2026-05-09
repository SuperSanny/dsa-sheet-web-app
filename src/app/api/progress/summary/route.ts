import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { getUserIdFromHeader } from "@/lib/auth";
import { Progress } from "@/models/Progress";
import { Problem } from "@/models/Problem";

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

  const completed = await Progress.find({ userId, completed: true });
  if (completed.length === 0) return NextResponse.json({ summary: {} });

  const problemIds = completed.map((p) => p.problemId);
  const problems = await Problem.find({ _id: { $in: problemIds } }).select(
    "topicId",
  );

  const summary: Record<string, number> = {};
  for (const p of problems) {
    const tid = p.topicId.toString();
    summary[tid] = (summary[tid] ?? 0) + 1;
  }

  return NextResponse.json({ summary });
}
