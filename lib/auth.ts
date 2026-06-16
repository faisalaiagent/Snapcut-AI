import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || supabaseAnonKey || "placeholder-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const providers: NextAuthConfig["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "SnapCut AI <noreply@snapcut.ai>",
    })
  );
}

if (providers.length === 0) {
  providers.push(
    Google({
      clientId: "placeholder",
      clientSecret: "placeholder",
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        if (supabaseUrl) {
          try {
            const { data } = await supabaseAdmin
              .from("users")
              .upsert(
                {
                  id: user.id,
                  email: user.email ?? "",
                  name: user.name,
                  image: user.image,
                },
                { onConflict: "id", ignoreDuplicates: false }
              )
              .select("plan")
              .single();
            token.plan = (data as { plan?: string } | null)?.plan ?? "free";
          } catch {
            token.plan = "free";
          }
        } else {
          token.plan = "free";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.plan) (session.user as unknown as Record<string, unknown>).plan = token.plan as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production",
});
