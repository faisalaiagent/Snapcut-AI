"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, CheckCircle, Mail, Clock } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/utils/cn";

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  subject: z.string().min(4).max(200),
  message: z.string().min(20).max(5000),
});
type Form = z.infer<typeof schema>;

function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setSent(true);
  };

  if (sent) {
    return (
      <div className="card text-center py-12">
        <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="font-semibold text-xl text-ink mb-2">Message sent!</h3>
        <p className="text-ink-3">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-base">Your name</label>
          <input
            className={cn("input-base", errors.name && "border-red-400")}
            placeholder="Your name"
            {...register("name")}
          />
        </div>
        <div>
          <label className="label-base">Email address</label>
          <input
            type="email"
            className={cn("input-base", errors.email && "border-red-400")}
            placeholder="you@example.com"
            {...register("email")}
          />
        </div>
      </div>
      <div>
        <label className="label-base">Subject</label>
        <input
          className={cn("input-base", errors.subject && "border-red-400")}
          placeholder="Question about Pro plan"
          {...register("subject")}
        />
      </div>
      <div>
        <label className="label-base">Message</label>
        <textarea
          rows={5}
          className={cn("input-base resize-none", errors.message && "border-red-400")}
          placeholder="Tell us how we can help…"
          {...register("message")}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12">
          <div>
            <p className="section-tag">Contact</p>
            <h1 className="font-serif text-4xl text-ink mb-5">Get in touch</h1>
            <p className="text-[17px] text-ink-3 font-light leading-relaxed mb-10">
              Have a question, feature request, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[12px] text-ink-4">Email us</p>
                  <a
                    href="mailto:faisalagentai@gmail.com"
                    className="text-[14px] font-medium text-ink hover:text-accent transition-colors"
                  >
                    faisalagentai@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[12px] text-ink-4">Response time</p>
                  <p className="text-[14px] font-medium text-ink">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
