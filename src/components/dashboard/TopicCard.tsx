"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Topic } from "@/types";
import { ProgressBar } from "./ProgressBar";

interface Props {
  topic: Topic;
  completed: number;
}

export function TopicCard({ topic, completed }: Props) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link
        href={`/dashboard/${topic.slug}`}
        className="block rounded-xl border border-[#1f2937] bg-[#111827] p-5 hover:border-[#374151] transition-colors duration-200"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#0b0f19] border border-[#1f2937] flex items-center justify-center text-xl shrink-0">
            {topic.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[#f3f4f6] text-sm leading-5">
              {topic.name}
            </h3>
            <p className="text-xs text-[#9ca3af] mt-0.5 line-clamp-2 leading-relaxed">
              {topic.description}
            </p>
          </div>
        </div>
        <ProgressBar completed={completed} total={topic.problemCount} />
      </Link>
    </motion.div>
  );
}
