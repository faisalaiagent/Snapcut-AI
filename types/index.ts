// ─── User & Auth ──────────────────────────────────────────────────────────

export type Plan = "free" | "pro" | "business";

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  plan: Plan;
  creditsUsed: number;
  createdAt: string;
}

// ─── Images ───────────────────────────────────────────────────────────────

export type ToolType =
  | "background_remover"
  | "white_background"
  | "passport_photo"
  | "linkedin_photo"
  | "instagram_dp";

export type ImageStatus = "pending" | "processing" | "completed" | "failed";

export interface ImageRecord {
  id: string;
  userId: string;
  originalUrl: string;
  processedUrl: string | null;
  toolUsed: ToolType;
  status: ImageStatus;
  metadata: Record<string, unknown>;
  fileSizeBytes: number | null;
  createdAt: string;
}

// ─── API responses ────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Processing results ───────────────────────────────────────────────────

export interface ProcessResult {
  imageId: string;
  originalUrl: string;
  processedUrl: string;
  toolUsed: ToolType;
}

// ─── Upload ───────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  publicId: string;
  bytes: number;
}

// ─── Subscription ─────────────────────────────────────────────────────────

export interface SubscriptionRecord {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete" | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────

export interface DashboardStats {
  totalImages: number;
  imagesThisMonth: number;
  dailyUsage: number;
  dailyLimit: number | null;  // null means unlimited (Pro/Business)
  plan: Plan;
}
