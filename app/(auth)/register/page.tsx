import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account – SnapCut AI",
  description:
    "Create a free SnapCut AI account. 5 free image edits per day, no credit card required.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[18px] font-semibold text-ink tracking-tight">
              SnapCut AI
            </span>
          </Link>
          <h1 className="font-serif text-2xl text-ink mt-6 mb-2">
            Create your free account
          </h1>
          <p className="text-[14px] text-ink-3">
            5 free edits per day. No credit card needed.
          </p>
        </div>

        <div className="card">
          <LoginForm />
        </div>

        <p className="text-center text-[13px] text-ink-4 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:underline font-medium no-underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
