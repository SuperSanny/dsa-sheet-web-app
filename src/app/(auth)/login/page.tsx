"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast(msg || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm"
      >
        <div className="mb-7 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#6366f1]/15 mb-4">
            <span className="text-lg">📊</span>
          </div>
          <h1 className="text-xl font-semibold text-[#f3f4f6]">Welcome back</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Sign in to continue your practice
          </p>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg px-3.5 py-2.5 text-sm text-[#f3f4f6] placeholder:text-[#374151] outline-none focus:border-[#4f51c8] transition-colors"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9ca3af] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg px-3.5 py-2.5 text-sm text-[#f3f4f6] placeholder:text-[#374151] outline-none focus:border-[#4f51c8] transition-colors"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6366f1] hover:bg-[#5254cc] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-1"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6b7280] mt-4">
          No account?{" "}
          <Link
            href="/signup"
            className="text-[#6366f1] hover:text-[#818cf8] transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
