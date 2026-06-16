import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In – SnapCut AI",
  description: "Sign in to your SnapCut AI account to access your image editing tools and history.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[18px] font-semibold text-ink tracking-tight">SnapCut AI</span>
          </Link>
          <h1 className="font-serif text-2xl text-ink mt-6 mb-2">Welcome back</h1>
          <p className="text-[14px] text-ink-3">Sign in to your account</p>
        </div>

        <div className="card">
          <LoginForm />
        </div>

        <p className="text-center text-[13px] text-ink-4 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:underline font-medium no-underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
