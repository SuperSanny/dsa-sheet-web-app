"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopicCard } from "@/components/dashboard/TopicCard";
import { TopicCardSkeleton } from "@/components/ui/Skeleton";
import { topicsApi, progressApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Topic } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([topicsApi.getAll(), progressApi.getSummary()])
      .then(([topicsRes, progressRes]) => {
        setTopics(topicsRes.data);
        setSummary(progressRes.data.summary);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = topics.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalProblems = topics.reduce((sum, t) => sum + t.problemCount, 0);
  const totalSolved = Object.values(summary).reduce((sum, n) => sum + n, 0);
  const pct =
    totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#f3f4f6]">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[#6b7280] mt-0.5">
          Keep going — consistency beats intensity.
        </p>
      </div>

      {/* Stats row */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Total Problems", value: totalProblems },
            { label: "Solved", value: totalSolved, accent: true },
            { label: "Remaining", value: totalProblems - totalSolved },
            { label: "Completion", value: `${pct}%`, accent: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3.5"
            >
              <p className="text-xs text-[#6b7280] mb-1">{stat.label}</p>
              <p
                className={`text-xl font-bold ${stat.accent ? "text-[#6366f1]" : "text-[#f3f4f6]"}`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5563]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics..."
          className="w-full bg-[#111827] border border-[#1f2937] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#f3f4f6] placeholder:text-[#374151] outline-none focus:border-[#374151] transition-colors"
        />
      </div>

      {/* Topic grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#9ca3af] text-sm">
            No topics found for &quot;{search}&quot;
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((topic, i) => (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <TopicCard topic={topic} completed={summary[topic._id] ?? 0} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
