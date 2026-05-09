"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Topic } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface Props {
  topics: Topic[];
}

export function Sidebar({ topics }: Props) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="px-5 py-4 border-b border-[#1f2937]">
        <span className="text-[#f3f4f6] font-bold text-base tracking-tight">
          DSA Sheet
        </span>
        <p className="text-[#4b5563] text-xs mt-0.5">
          Practice. Track. Master.
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
            pathname === "/dashboard"
              ? "bg-[#1f2937] text-[#f3f4f6]"
              : "text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#111827]"
          }`}
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
          Overview
        </Link>

        <div className="mt-3 mb-1.5 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#374151]">
            Topics
          </span>
        </div>

        {topics.map((topic) => {
          const active = pathname === `/dashboard/${topic.slug}`;
          return (
            <Link
              key={topic._id}
              href={`/dashboard/${topic.slug}`}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors relative ${
                active
                  ? "bg-[#1f2937] text-[#f3f4f6]"
                  : "text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#111827]"
              }`}
            >
              <span className="text-base leading-none shrink-0">
                {topic.icon}
              </span>
              <span className="flex-1 truncate">{topic.name}</span>
              {active && (
                <motion.div
                  layoutId="active-dot"
                  className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shrink-0"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1f2937]">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center text-sm font-semibold text-[#6366f1] shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f3f4f6] truncate leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-[#4b5563] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-[#6b7280] hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-[#1f2937] bg-[#0b0f19] hidden md:flex">
        {navContent}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0b0f19] border-b border-[#1f2937]">
        <span className="text-[#f3f4f6] font-bold text-sm">DSA Sheet</span>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-8 h-8 flex items-center justify-center text-[#9ca3af]"
        >
          {mobileOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-30 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.22 }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-40 w-56 flex flex-col bg-[#0b0f19] border-r border-[#1f2937]"
            >
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
