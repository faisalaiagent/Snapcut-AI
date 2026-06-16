import { z } from "zod";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/heic"] as const;
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

// ─── Upload ───────────────────────────────────────────────────────────────

export const uploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Must be a file" })
    .refine((f) => f.size <= MAX_BYTES, {
      message: "File must be under 20 MB",
    })
    .refine((f) => (ALLOWED_MIME as readonly string[]).includes(f.type), {
      message: "Unsupported format. Use JPG, PNG, WEBP, or HEIC.",
    }),
});

// ─── Passport ─────────────────────────────────────────────────────────────

export const passportSchema = z.object({
  imageId: z.string().uuid({ message: "Invalid image ID" }),
  country: z.enum(["usa", "uk", "canada", "australia", "india", "pakistan", "uae"], {
    errorMap: () => ({ message: "Unsupported country" }),
  }),
});

// ─── White background ─────────────────────────────────────────────────────

export const whiteBgSchema = z.object({
  imageId: z.string().uuid(),
  width: z.coerce.number().int().min(500).max(5000).default(2000),
  height: z.coerce.number().int().min(500).max(5000).default(2000),
  padding: z.coerce.number().int().min(0).max(500).default(150),
});

// ─── Process (generic) ────────────────────────────────────────────────────

export const processSchema = z.object({
  imageId: z.string().uuid({ message: "Invalid image ID" }),
});

// ─── Checkout ─────────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID required"),
});

// ─── Contact form ─────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(4).max(200),
  message: z.string().min(20).max(5000),
});
