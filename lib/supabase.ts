import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Browser/anon client — safe for client components
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Server-only admin client — never expose to browser
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || supabaseAnonKey || "placeholder-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Helper: get user row from DB
export async function getUser(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

// Helper: get user's daily usage count (resets at midnight UTC)
export async function getDailyUsage(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabaseAdmin
    .from("usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("timestamp", startOfDay.toISOString());

  if (error) return 0;
  return count ?? 0;
}

// Helper: log a usage event
export async function logUsage(
  userId: string,
  action: string,
  tool: string,
  imageId?: string
) {
  try {
    await supabaseAdmin.from("usage_logs").insert({
      user_id: userId,
      action,
      tool,
      image_id: imageId ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Silent fail — don't break the app if logging fails
  }
}

// Helper: save image record
export async function saveImageRecord(params: {
  userId: string;
  originalUrl: string;
  processedUrl?: string;
  cloudinaryOriginalId?: string;
  cloudinaryProcessedId?: string;
  toolUsed: string;
  status?: string;
  metadata?: Record<string, unknown>;
  fileSizeBytes?: number;
}) {
  const { data, error } = await supabaseAdmin
    .from("images")
    .insert({
      user_id: params.userId,
      original_url: params.originalUrl,
      processed_url: params.processedUrl,
      cloudinary_original_id: params.cloudinaryOriginalId,
      cloudinary_processed_id: params.cloudinaryProcessedId,
      tool_used: params.toolUsed,
      status: params.status ?? "completed",
      metadata: params.metadata ?? {},
      file_size_bytes: params.fileSizeBytes,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}
