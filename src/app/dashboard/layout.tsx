"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { topicsApi } from "@/services/api";
import { Topic } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      topicsApi
        .getAll()
        .then((res) => setTopics(res.data))
        .catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar topics={topics} />
      <main className="flex-1 overflow-y-auto md:pl-0 pt-12 md:pt-0">
        {children}
      </main>
    </div>
  );
}
