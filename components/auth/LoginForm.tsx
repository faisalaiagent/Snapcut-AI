"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";
import { cn } from "@/utils/cn";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type EmailForm = z.infer<typeof emailSchema>;

export function LoginForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleEmail = async (data: EmailForm) => {
    await signIn("resend", { email: data.email, redirect: false, callbackUrl: "/dashboard" });
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="w-12 h-12 bg-accent-light rounded-2xl mx-auto flex items-center justify-center">
          <Mail className="w-6 h-6 text-accent" />
        </div>
        <h3 className="font-semibold text-ink">Check your email</h3>
        <p className="text-[14px] text-ink-3">We sent a magic link to your inbox. Click it to sign in.</p>
        <button
          onClick={() => setEmailSent(false)}
          className="text-[13px] text-accent hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-surface-3 bg-white hover:bg-surface-2 transition-all text-[15px] font-medium text-ink disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-3" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[12px] text-ink-4">or continue with email</span>
        </div>
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit(handleEmail)} className="space-y-3">
        <div>
          <label className="label-base">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={cn("input-base", errors.email && "border-red-400 focus:border-red-500 focus:ring-red-500/20")}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send magic link"}
        </button>
      </form>

      <p className="text-[12px] text-ink-4 text-center">
        By signing in you agree to our{" "}
        <a href="/terms" className="hover:underline text-ink-3">Terms</a> and{" "}
        <a href="/privacy" className="hover:underline text-ink-3">Privacy Policy</a>.
      </p>
    </div>
  );
}
