import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import { Problem } from "@/models/Problem";

export async function GET() {
  try {
    await connect();
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "DB error" },
      { status: 500 },
    );
  }
  const topics = await Topic.find().sort({ order: 1 });

  const counts = await Problem.aggregate([
    { $group: { _id: "$topicId", count: { $sum: 1 } } },
  ]);
  const countMap = counts.reduce<Record<string, number>>((acc, c: any) => {
    acc[c._id.toString()] = c.count;
    return acc;
  }, {});

  const result = topics.map((t) => ({
    ...t.toObject(),
    problemCount: countMap[t._id.toString()] ?? 0,
  }));
  return NextResponse.json(result);
}
