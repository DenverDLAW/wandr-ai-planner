# Wandr — AI Vacation Planner — Setup Guide

## Prerequisites
- Node.js 18+
- A Supabase account (free at supabase.com)
- An Anthropic API key (console.anthropic.com)
- A Pexels API key (free at pexels.com/api)

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon public key** (Settings → API)
3. Also copy the **service_role secret key** (keep this server-side only)

### Run the database schema

In Supabase Dashboard → **SQL Editor** → paste the contents of `supabase-schema.sql` and click Run.

---

## 2. Get API Keys

### Anthropic
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an API key

### Pexels
1. Visit [pexels.com/api](https://www.pexels.com/api/) → Create a free account
2. Copy your **API Key** from the dashboard

---

## 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your real keys:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ANTHROPIC_API_KEY=sk-ant-...
PEXELS_API_KEY=your-pexels-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Configure Supabase Auth

In Supabase Dashboard → **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

---

## 5. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 6. Production Deployment

Deploy to Vercel (recommended for Next.js):

```bash
npx vercel
```

Update environment variables in Vercel dashboard and update:
- `NEXT_PUBLIC_APP_URL` → your Vercel domain
- Supabase Auth → add your Vercel domain to Redirect URLs

---

## Full User Flow

1. **Landing page** (`/`) → "Plan My Trip" CTA
2. **Planner** (`/plan`) → 6 scroll-snap sections:
   - Name → Dates → Trip Categories → Travelers → Budget → Ready
3. **Generating...** → Claude AI builds your itinerary
4. **Itinerary** → Magazine-style display with photos, booking links, cost summary
5. **PDF Download** → Full visual travel magazine PDF
6. **Share** → Email sharing or copy link
7. **Save Trip** → Sign up / log in to save to dashboard
8. **Dashboard** (`/dashboard`) → All saved trips
9. **Trip Detail** (`/trips/[id]`) → Full saved itinerary

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                     # Landing page
│   ├── plan/page.tsx                # Typeform-style planner
│   ├── (auth)/login/ signup/        # Auth pages
│   ├── (dashboard)/dashboard/       # Saved trips
│   ├── (dashboard)/trips/[id]/      # Trip detail
│   └── api/
│       ├── generate-itinerary/      # Claude AI pipeline
│       ├── generate-pdf/            # PDF download
│       └── trips/ trips/[id]/       # CRUD
├── components/
│   ├── planner/                     # 6 scroll sections + generating screen
│   └── itinerary/                   # Magazine-style UI components
├── lib/
│   ├── ai/claude.ts                 # Claude prompt builder
│   ├── images.ts                    # Pexels API
│   ├── pdf/itinerary-pdf.tsx        # PDF layout
│   └── url-builders.ts              # Booking deep-links
└── types/                           # TypeScript types
```
