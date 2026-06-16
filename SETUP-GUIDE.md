# SnapCut AI — Complete Setup Guide
### Phase 1 MVP · Next.js 15 · TypeScript · Tailwind · Supabase · Cloudinary · Stripe

---

## 📁 Project Structure (75+ files)

```
snapcut-ai/
│
├── app/                              ← Next.js 15 App Router
│   ├── (marketing)/                  ← Public marketing pages
│   │   ├── page.tsx                  ← Home page (hero, tools, pricing, FAQ)
│   │   ├── pricing/page.tsx          ← Full pricing page
│   │   ├── about/page.tsx            ← About page (AdSense required)
│   │   ├── contact/page.tsx          ← Contact form (AdSense required)
│   │   ├── privacy/page.tsx          ← Privacy policy (AdSense required)
│   │   └── terms/page.tsx            ← Terms of service (AdSense required)
│   │
│   ├── (auth)/                       ← Authentication pages
│   │   ├── login/page.tsx            ← Sign in (Google + magic link)
│   │   └── register/page.tsx         ← Sign up
│   │
│   ├── (dashboard)/                  ← Protected pages (auth-gated)
│   │   ├── layout.tsx                ← Sidebar + topbar shell
│   │   ├── dashboard/page.tsx        ← Stats overview
│   │   └── tools/
│   │       ├── background-remover/   ← AI background removal
│   │       ├── white-background/     ← eCommerce white BG generator
│   │       ├── passport-photo/       ← Passport photo for 7 countries
│   │       ├── linkedin-photo/       ← LinkedIn 400×400 optimizer
│   │       └── instagram-dp/         ← Instagram 320×320 DP
│   │
│   ├── api/                          ← Backend API routes
│   │   ├── auth/[...nextauth]/       ← Auth.js handler
│   │   ├── upload/sign/              ← Cloudinary signed upload
│   │   ├── process/                  ← 5 image processing routes
│   │   ├── stripe/                   ← checkout, portal, webhook
│   │   ├── usage/                    ← Daily usage stats
│   │   ├── history/                  ← Image history (GET + DELETE)
│   │   └── contact/                  ← Contact form email
│   │
│   ├── layout.tsx                    ← Root layout + SEO metadata + fonts
│   ├── globals.css                   ← Design tokens + Tailwind layers
│   ├── robots.ts                     ← robots.txt (auto-generated)
│   └── sitemap.ts                    ← XML sitemap (auto-generated)
│
├── components/
│   ├── ui/Toaster.tsx                ← Global toast notifications
│   ├── marketing/                    ← Hero, Stats, Tools, HowItWorks,
│   │                                    BeforeAfter, Pricing, Testimonials, FAQ
│   ├── tools/                        ← UploadZone, ImagePreview (slider),
│   │                                    ProcessingStatus, CountrySelector
│   ├── dashboard/                    ← Sidebar, Topbar, StatsCards,
│   │                                    QuickTools, RecentImages
│   ├── auth/LoginForm.tsx            ← Google + magic link sign in
│   └── shared/                       ← Navbar, Footer
│
├── lib/                              ← Core integrations
│   ├── auth.ts                       ← Auth.js v5 config
│   ├── supabase.ts                   ← DB client + helpers
│   ├── cloudinary.ts                 ← Upload, delete, CDN URL builder
│   ├── remove-bg.ts                  ← remove.bg API wrapper
│   ├── sharp-utils.ts                ← All image processing functions
│   ├── stripe.ts                     ← Checkout, portal, webhook utils
│   └── rate-limiter.ts               ← In-memory rate limiting
│
├── actions/                          ← Next.js Server Actions
│   ├── process-image.ts              ← All 5 tool processing actions
│   ├── upload.ts                     ← Save upload record to DB
│   └── subscription.ts              ← Stripe checkout + portal redirect
│
├── hooks/
│   ├── useUpload.ts                  ← Client upload state + Cloudinary flow
│   └── useProcessing.ts             ← Processing state management
│
├── types/
│   ├── index.ts                      ← AppUser, Plan, ImageRecord, etc.
│   └── supabase.ts                   ← Full DB type definitions
│
├── utils/
│   ├── cn.ts                         ← clsx + tailwind-merge
│   ├── format.ts                     ← formatDate, formatBytes, TOOL_LABELS
│   └── validation.ts                 ← Zod schemas for all inputs
│
├── supabase/migrations/
│   └── 001_initial_schema.sql        ← Complete DB schema + RLS policies
│
├── middleware.ts                     ← Auth guard + rate limiting
├── next.config.ts                    ← Image domains, security headers
├── tailwind.config.ts                ← Design tokens + animations
├── tsconfig.json                     ← TypeScript config
├── postcss.config.mjs                ← PostCSS for Tailwind
├── eslint.config.mjs                 ← ESLint config
├── package.json                      ← All dependencies
├── .env.example                      ← All required env vars
└── .gitignore
```

---

## 🚀 Setup in 20 Minutes

### Step 1 — Create Next.js project

```bash
npx create-next-app@latest snapcut-ai \
  --typescript --tailwind --app \
  --import-alias "@/*" \
  --src-dir=no

cd snapcut-ai
```

### Step 2 — Copy project files

Unzip `snapcut-ai-complete.zip` and copy ALL files into your project root, overwriting the defaults created by `create-next-app`. The structure is already correct.

### Step 3 — Install dependencies

```bash
npm install \
  next-auth@beta \
  @auth/supabase-adapter \
  @supabase/supabase-js \
  cloudinary \
  sharp \
  stripe \
  zod \
  clsx \
  tailwind-merge \
  framer-motion \
  lucide-react \
  react-hook-form \
  @hookform/resolvers \
  @types/sharp
```

### Step 4 — Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every value. Instructions for each service below.

---

## 🔧 Service Setup

### Supabase (Database + Auth adapter)

1. Create free project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **SQL Editor** → paste and run the entire contents of `supabase/migrations/001_initial_schema.sql`
4. This creates: `users`, `images`, `subscriptions`, `usage_logs` tables + all RLS policies

### Cloudinary (Image Storage + CDN)

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard** → copy:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME` + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`
3. No other config needed — folders are created automatically on first upload

### remove.bg (AI Background Removal)

1. Create account at [remove.bg/api](https://www.remove.bg/api)
2. Go to **API Keys** → create key → `REMOVE_BG_API_KEY`
3. **Free tier**: 50 API calls/month (perfect for testing)
4. **Paid plans**: from $0.20/image or subscription plans for higher volume

### Google OAuth (Social Login)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → **APIs & Services → OAuth consent screen** → External
3. **Credentials → Create Credentials → OAuth 2.0 Client ID** → Web application
4. Authorised redirect URIs — add both:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID → `GOOGLE_CLIENT_ID`
6. Copy Client Secret → `GOOGLE_CLIENT_SECRET`

### Resend (Magic Link Email)

1. Create account at [resend.com](https://resend.com)
2. **API Keys → Create API Key** → `RESEND_API_KEY`
3. Verify your sending domain (or use `onboarding@resend.dev` for testing)
4. Set `CONTACT_EMAIL` to where you want contact form submissions sent

### Auth.js Secret

```bash
# Generate a secure random secret:
openssl rand -base64 32
```
Paste the output into `NEXTAUTH_SECRET`.

### Stripe (Payments)

1. Create account at [stripe.com](https://stripe.com)
2. **Developers → API Keys** → copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. **Products → Create Product** → "SnapCut Pro" → $12/month recurring
   - Copy Price ID → `STRIPE_PRO_PRICE_ID`
4. **Products → Create Product** → "SnapCut Business" → $39/month recurring
   - Copy Price ID → `STRIPE_BUSINESS_PRICE_ID`
5. **Developers → Webhooks → Add endpoint**:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`
   - Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`
6. **Local webhook testing**:
   ```bash
   # Install Stripe CLI (mac)
   brew install stripe/stripe-cli/stripe
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # Copy the webhook signing secret it prints → STRIPE_WEBHOOK_SECRET
   ```

---

## 🔑 Environment Variables Reference

```bash
# ── App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Auth.js
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── Email
RESEND_API_KEY=re_xxxx
CONTACT_EMAIL=support@yourdomain.com

# ── Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ── Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxx_secret

# ── remove.bg
REMOVE_BG_API_KEY=your-api-key

# ── Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_PRO_PRICE_ID=price_xxxx
STRIPE_BUSINESS_PRICE_ID=price_xxxx
```

---

## 💻 Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Run Stripe webhooks in a second terminal:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🌐 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

**In Vercel dashboard:**
1. **Settings → Environment Variables** → add all variables from `.env.local`
2. Change `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to your production domain
3. **Redeploy** after adding env vars

**After deploying:**
- Update Google OAuth: add `https://yourdomain.com/api/auth/callback/google` to authorised redirect URIs
- Update Stripe webhook: change endpoint URL to `https://yourdomain.com/api/stripe/webhook`
- Update `NEXTAUTH_URL` to `https://yourdomain.com`

---

## 🗺️ API Routes Summary

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | — | Auth.js login/logout |
| `/api/upload/sign` | POST | ✓ | Cloudinary upload signature |
| `/api/process/remove-bg` | POST | ✓ | AI background removal |
| `/api/process/white-bg` | POST | ✓ | White background generator |
| `/api/process/passport` | POST | ✓ | Passport photo resize |
| `/api/process/linkedin` | POST | ✓ | LinkedIn photo optimizer |
| `/api/process/instagram` | POST | ✓ | Instagram DP optimizer |
| `/api/stripe/checkout` | POST | ✓ | Create checkout session |
| `/api/stripe/portal` | POST | ✓ | Open billing portal |
| `/api/stripe/webhook` | POST | Sig | Handle subscription events |
| `/api/usage` | GET | ✓ | Daily + monthly usage stats |
| `/api/history` | GET | ✓ | Paginated image history |
| `/api/history` | DELETE | ✓ | Delete an image record |
| `/api/contact` | POST | — | Contact form submission |

---

## 📐 Database Schema

```sql
users         → id, email, name, image, plan, credits_used, created_at
images        → id, user_id, original_url, processed_url, tool_used, status, metadata
subscriptions → id, user_id, stripe_customer_id, stripe_subscription_id, status
usage_logs    → id, user_id, action, tool, image_id, timestamp
```

All tables have **Row Level Security (RLS)** — users can only read/write their own rows.

---

## 📦 Subscription Plans

| Plan | Price | Daily Limit | Features |
|---|---|---|---|
| Free | $0 | 5 edits/day | All tools, watermarked exports |
| Pro | $12/mo | Unlimited | HD exports, no watermark, 7-day trial |
| Business | $39/mo | Unlimited | Bulk processing, team seats, priority support |

---

## ✅ Phase 2 — Next Steps

After MVP is live, implement:

- [ ] `app/(dashboard)/projects/page.tsx` — full paginated history with tool filters
- [ ] `app/(dashboard)/settings/page.tsx` — profile update
- [ ] `app/(dashboard)/settings/billing/page.tsx` — subscription management UI
- [ ] Watermark overlay using Sharp composite for Free plan downloads
- [ ] Cookie consent banner (required for AdSense + GDPR)
- [ ] Blog system with MDX for SEO content
- [ ] OG image generation with `next/og`
- [ ] Loading skeleton components
- [ ] Error boundary components
- [ ] `SessionProvider` wrapper in root layout for `useSession()` in client components

---

## 🆘 Common Issues

**"Module not found: @/lib/auth"**
→ Make sure `tsconfig.json` has `"paths": { "@/*": ["./*"] }` and you're in the project root.

**"Supabase: relation does not exist"**
→ You haven't run the SQL migration yet. Go to Supabase → SQL Editor → run `001_initial_schema.sql`.

**"remove.bg: 402 Insufficient credits"**
→ Free tier exhausted (50/month). Add billing at remove.bg or use your own API key.

**"Stripe webhook signature verification failed"**
→ Make sure you're using the CLI signing secret (starts with `whsec_`) for local testing, not the dashboard secret. They're different.

**Images not showing (Cloudinary 401)**
→ Check `CLOUDINARY_API_SECRET` — it's not the API Key. They're different values in the Cloudinary dashboard.

---

## 📞 Support

- Email: support@snapcut.ai
- Docs: [docs.snapcut.ai](https://docs.snapcut.ai)
