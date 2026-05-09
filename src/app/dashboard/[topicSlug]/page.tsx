"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProblemRow } from "@/components/dashboard/ProblemRow";
import { ProblemRowSkeleton } from "@/components/ui/Skeleton";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { topicsApi, progressApi } from "@/services/api";
import { Topic, Problem } from "@/types";

type Filter = "All" | "Easy" | "Medium" | "Hard";

export default function TopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const router = useRouter();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([topicsApi.getBySlug(topicSlug), progressApi.getCompleted()])
      .then(([topicRes, progressRes]) => {
        setTopic(topicRes.data.topic);
        setProblems(topicRes.data.problems);
        setCompleted(new Set(progressRes.data.completedIds));
      })
      .catch(() => router.replace("/dashboard"))
      .finally(() => setLoading(false));
  }, [topicSlug, router]);

  function handleToggle(problemId: string, isCompleted: boolean) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (isCompleted) next.add(problemId);
      else next.delete(problemId);
      return next;
    });
  }

  const filtered =
    filter === "All"
      ? problems
      : problems.filter((p) => p.difficulty === filter);

  const counts = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#9ca3af] transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        All topics
      </Link>

      {loading ? (
        <div>
          <div className="h-7 bg-[#1f2937] animate-pulse rounded w-48 mb-2" />
          <div className="h-4 bg-[#1f2937] animate-pulse rounded w-72 mb-6" />
          <div className="h-1.5 bg-[#1f2937] rounded-full mb-8" />
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProblemRowSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : topic ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#111827] border border-[#1f2937] flex items-center justify-center text-xl shrink-0 mt-0.5">
              {topic.icon}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#f3f4f6]">
                {topic.name}
              </h1>
              <p className="text-sm text-[#6b7280] mt-0.5">
                {topic.description}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <ProgressBar
              completed={problems.filter((p) => completed.has(p._id)).length}
              total={problems.length}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(["All", "Easy", "Medium", "Hard"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  filter === f
                    ? "bg-[#6366f1] border-[#6366f1] text-white"
                    : "border-[#1f2937] text-[#6b7280] hover:text-[#9ca3af] hover:border-[#374151]"
                }`}
              >
                {f}
                {f !== "All" && (
                  <span className="ml-1.5 opacity-60">{counts[f]}</span>
                )}
              </button>
            ))}
          </div>

          {/* Problem list */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#6b7280]">
                  No {filter} problems in this topic
                </p>
              </div>
            ) : (
              filtered.map((problem) => (
                <ProblemRow
                  key={problem._id}
                  problem={problem}
                  isCompleted={completed.has(problem._id)}
                  onToggle={handleToggle}
                />
              ))
            )}
          </div>

          {problems.length > 0 &&
            problems.every((p) => completed.has(p._id)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 bg-[#111827] border border-emerald-900/40 rounded-xl px-5 py-4 text-center"
              >
                <p className="text-emerald-400 text-sm font-medium">
                  🎉 All problems completed — great work!
                </p>
              </motion.div>
            )}
        </motion.div>
      ) : null}
    </div>
  );
}
