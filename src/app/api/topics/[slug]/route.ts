import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import { Problem } from "@/models/Problem";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = req.url.split("/").pop() || searchParams.get("slug");
  if (!slug)
    return NextResponse.json({ message: "Missing slug" }, { status: 400 });

  try {
    await connect();
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "DB error" },
      { status: 500 },
    );
  }
  const topic = await Topic.findOne({ slug });
  if (!topic)
    return NextResponse.json({ message: "Topic not found" }, { status: 404 });

  const problems = await Problem.find({ topicId: topic._id }).sort({
    order: 1,
  });
  return NextResponse.json({ topic, problems });
}
