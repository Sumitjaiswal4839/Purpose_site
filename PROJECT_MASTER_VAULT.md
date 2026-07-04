# 🏛️ PROJECT MASTER VAULT - PURPOSE SITE

**Last Updated:** May 11, 2026
**Current Phase:** Phase 4 (Polish & Optimization)
**Project Status:** 🚀 95% Complete

---

## 📋 PROJECT OVERVIEW
A high-end, premium proposal SaaS where users create cinematic, time-limited proposal links for their partners. Features multi-step wizards, live editing, music integration, and secure activation via manual payment verification.

---

## ✨ RECENT FEATURE UPDATES (NEW!)

### 🎨 Romantic SaaS Aesthetic (Global)
- **ScrollHeart Animation**: Persistent, scroll-linked heart micro-interactions across all pages.
- **Glassmorphic UI**: Unified design language using HSL tailored colors (Rose-500, Indigo-600) and backdrop blurs.
- **Dynamic Previews**: Dedicated interactive preview routes for specific themes:
  - **Best Friend → GF**: Warm, amber-themed "Floating Memories" timeline.
  - **I'm So Sorry (Apology)**: Cinematic envelope opening with scrolling letter and nostalgic collage.

### 🛡️ System Stability & Prisma 7 Migration
- **Prisma 7.8.0 Integration**: Migrated to Prisma 7, resolving `engineType` issues and optimizing `PrismaClient` instantiation.
- **Editor SSR Fix**: Implemented resilient dynamic imports for `TimelineEditor` and `CreativeCanvas` to solve hydration mismatches.
- **API Robustness**: Standardized `/api/custom-requests` to handle multiple request types (Custom, Feedback, Idea) with JSON validation.

### 💡 Engagement Hub
- **Feedback & Ideas System**: Dedicated modules for users to submit improvement suggestions and new template ideas.
- **Admin Command Center**: Real-time monitoring of proposal links, view counts, and custom request management.

---

## 🛠️ TECHNICAL ARCHITECTURE

### Backend Stack
- **Framework**: Next.js 15 (App Router / Turbopack)
- **Database**: PostgreSQL via Prisma 7.8.0
- **Storage**: Cloudinary (Media)
- **Config**: `prisma.config.ts` for centralized datasource management.

### Database Schema (Prisma)
- **SecretLink**: Core proposal data, tokenization, and view-limiting logic.
- **CustomRequest**: Unified table for custom orders, user feedback, and platform ideas.
- **Admin**: Credentials for the manual verification dashboard.

---

## 🏁 CRITICAL BLOCKERS & STATUS

### ✅ FIXED: Prisma 7 Compatibility
Removed deprecated `url` from `schema.prisma`. All connection logic is now handled via `accelerateUrl` (workaround) and `prisma.config.ts`.

### ✅ FIXED: Missing Theme Previews
Created missing preview routes for "Sorry" and specialized the "Best Friend" theme to match its description.

### ✅ FIXED: Editor TypeScript Conflicts
Resolved "Module type mismatch" errors in dynamic imports by selecting `mod.default` explicitly.

### ⏳ NEXT: Final Admin Polish
- Fixing JSON parsing robustness in Dashboard fetch calls.
- Implementing automatic cleanup for expired links (Cron job).

---

## 🚀 DEPLOYMENT & LOCAL SETUP

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`: For dashboard access.
- `GMAIL_USER` / `GMAIL_PASS`: For activation notifications.

### Local Commands
```bash
npm run dev          # Start dev server
npx prisma generate  # Update Prisma Client
npx prisma db push   # Sync DB Schema
```

---

## 📜 LEGACY DOCUMENTATION LOG

- **April 26:** Full Modular Editor Suite and iTunes Search integration.
- **May 09:** Feedback system and Admin panel decoupling.
- **May 11:** Prisma 7 migration, Dedicated Previews, and Global Aesthetic overhaul.

---

**End of Vault.**
