# Purpose Site — Complete Codebase Audit & Enterprise-Readiness Report

**Analysed on:** 10 September 2026
**Scope:** Full repo (frontend, backend/API, DB schema, config, middleware)

---

## 1. Executive Summary

| Area | Status |
|---|---|
| Frontend (UI/UX) | ~85% complete, polished |
| Backend (API routes) | ~70% complete, but has orphaned/duplicate routes |
| Frontend ↔ Backend wiring | Partially connected — several breaks/mismatches |
| Database | Schema/config mismatch (SQLite vs Postgres) |
| Security | Decent foundations, but not production/enterprise-grade yet |
| DevOps / Scalability | Not enterprise-ready (in-memory rate limiting, no CI/CD, no tests) |

**Bottom line:** Yeh ek achhi "MVP / demo-ready" SaaS hai, lekin abhi **"one working prototype"** stage par hai, na ki **"enterprise-grade product"**. Live karne se pehle Section 6 aur 7 zaroor padhna.

---

## 2. Feature-by-Feature Connection Map

### ✅ Fully Connected (Frontend + Backend + DB, working end-to-end)
| Feature | Frontend | Backend | Notes |
|---|---|---|---|
| Create Proposal flow | `/create` page | `/api/proposals/save` | Working, saves to `SecretLink` table |
| Manual UPI Payment | `/create` page (QR image) | `/api/payment/upi-qr`, `/api/payment/create-order` | Working but "verify" step depends on manual admin/email action |
| Secret Link viewing | `/secret/[token]` | `/api/links/verify` | Working — checks view limits, expiry |
| Admin Login | Admin page login form | `/api/admin/auth` + `adminAuth.ts` | Signed HMAC token, works correctly |
| Admin Dashboard (stats/links/requests) | Admin page | `/api/admin/stats`, `/api/admin/links`, `/api/admin/custom-requests` | Working, token-protected |
| Custom Request / Feedback / Idea forms | 3 separate pages | `/api/custom-requests` (shared route) | Working, unified table |
| Image Upload | Create page | `/api/upload/image` | Working (Cloudinary primary) |
| Admin Link Activation | Admin dashboard | `/api/admin/links/[token]` (PATCH) | Working |

### ⚠️ Backend exists but NOT called by any frontend (orphan APIs — dead weight or half-built)
| Route | What it does | Problem |
|---|---|---|
| `/api/payment/verify` (Razorpay) | Verifies Razorpay signature | Never called — no `RAZORPAY_KEY_ID/SECRET` set, and `RazorpayButton.tsx` component is not used anywhere in the actual app |
| `/api/payment/verify-manual` | Token-based email activation (GET) | Only usable if `sendVerificationEmail`'s link points here — needs confirming the email template actually links to this route; currently looks disconnected from the manual flow used in `/create` |
| `/api/admin/proposals` | Paginated proposal list w/ status filter | Duplicate of `/api/admin/links` — admin dashboard uses `links`, not this. Redundant or half-migrated |
| `/api/admin/redis-test` | Just returns `{status:'disabled'}` | Stub — Redis caching claimed in `lib/redis.ts`/`cache.ts` but never actually wired to real routes except `admin/stats` |

### 🖥️ Frontend exists but is NOT reachable / NOT linked from navigation (orphan pages)
| Page | Problem |
|---|---|
| `/editor` (652 lines — `TimelineEditor`, `CreativeCanvas`, `AssetLibrary`, filter/adjustment panels) | Not linked anywhere in `Navbar.tsx`. A large, seemingly complete video/photo editor suite that no user can reach through normal navigation |
| `ProposalEditor.jsx` (root-level, outside `src/`) | Sits outside Next.js's `src/app` — **not even part of the build**. Looks like an old/duplicate version of the editor kept by mistake |
| `/preview/valentine`, `/preview/prank`, `/preview/farewell` | Linked from `templates/page.tsx` but the actual page folders don't exist → **404 for real users** |

### 🧟 Dead code (imported nowhere, safe to delete or needs a decision)
- `src/lib/mongodb.ts` — leftover from a pre-Prisma version, unused anywhere
- `RazorpayButton.tsx` — self-contained, unused component
- `.env.local` comments show 3 different DB options were tried (Postgres / MariaDB / MongoDB) — config has never been cleaned up

---

## 3. Critical Bugs / Mismatches (fix before anything else)

1. **DB provider mismatch:** `prisma/schema.prisma` hardcodes `provider = "sqlite"`, but `.env.local`'s `DATABASE_URL` is a live **PostgreSQL (Railway)** connection string. This is a landmine — Prisma Client is generated for SQLite while your real DB is Postgres. This needs to be fixed to one consistent choice before deploying.
2. **Two competing payment systems** (Razorpay automated vs. Manual UPI + email/admin verification) exist in the code, but only one (manual) is wired to the UI. Confusing for future devs, and a security surface you're not even using.
3. **Two competing "editor" experiences** (`/create`'s inline editor vs. the full `/editor` route) — unclear which is the real product direction.
4. **In-memory rate limiting** (`middleware.ts`) resets on every server restart and **does not work across multiple server instances** — fine for a single Vercel/Node instance, breaks the moment you scale horizontally or use serverless with multiple concurrent instances.
5. **Broken preview links** on the Templates page (404s) — bad first impression for real users.
6. **`error_log.txt` and `tsconfig.tsbuildinfo`** were committed into the project (already flagged earlier) — these should never be in version control.
7. **`.env.local` was included in your shared zip** — it contains real DB URLs, JWT secrets, Gmail app password, admin password. This must never be shared/committed again; rotate all these secrets immediately since they've now been exposed outside your machine.

---

## 4. Security Review (current state)

**What's already done well:**
- Admin tokens are HMAC-signed with expiry (`adminAuth.ts`) — decent, not a toy implementation.
- Timing-safe comparisons used for password/signature checks (good — avoids timing attacks).
- Rate limiting exists conceptually (just not distributed).
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.) applied in `middleware.ts`.
- File upload validates size + MIME type before accepting.

**What's missing for enterprise-grade:**
- No CSRF protection on state-changing admin routes.
- No audit logging beyond `AccessLog` for secret links — no admin action logs (who activated what, when).
- Admin auth is single hardcoded username/password (`ADMIN_USERNAME`/`ADMIN_PASSWORD`) — no multi-admin support, no RBAC, no 2FA. Fine for a solo founder, not fine once you have a team.
- Secrets rotation strategy: none. All secrets live in a flat `.env` file with no secrets manager (e.g. Vercel env vars are fine for now, but there's no rotation/versioning plan).
- No dependency vulnerability scanning (no `npm audit` / Snyk / Dependabot config visible).
- SQLite (`database/purpose.db`) is committed as an actual binary file inside the repo — never do this in a real product; it will cause merge conflicts and is a data-loss risk.

---

## 5. Scalability / "Industry-Level" Gaps

Since you said this isn't "one site" but an **enterprise web app**, here's what's genuinely missing versus a hobby project:

1. **No automated tests** — no unit tests, no integration tests, no E2E tests (README *claims* Jest/Playwright are "supported" but zero test files exist in the repo).
2. **No CI/CD pipeline** — no `.github/workflows`, no lint/build/test gate before merge.
3. **No environment separation** — no clear dev/staging/production config split; single `.env.local` mixes all concerns.
4. **No centralized logging/monitoring** — `logger.ts` exists but there's no Sentry/Datadog/LogRocket-style error tracking wired in. In production you will not know when something breaks.
5. **No API documentation** — 17 API routes, zero OpenAPI/Swagger spec, no Postman collection.
6. **No database migrations discipline visible beyond one migration file** — for a growing schema you'll need a proper migration + rollback strategy.
7. **No horizontal scaling plan** — rate limiter, in-memory maps, and SQLite file will all break the moment you run more than one server instance.
8. **No caching layer actually active** — Redis is scaffolded but disabled; every stats call likely hits the DB directly.
9. **No load testing / performance benchmarking** done yet.
10. **No clear ownership of "source of truth"** for editor and payment (as noted above) — architecturally this needs a decision, not just cleanup.

---

## 6. Pre-Launch Checklist (do this before going live, even in current form)

- [ ] Fix Prisma provider vs `DATABASE_URL` mismatch — pick Postgres (recommended for production) and update `schema.prisma` accordingly, then re-run `npx prisma generate` and `npx prisma db push`.
- [ ] **Rotate every secret** in `.env.local` (JWT_SECRET, ENCRYPTION_SECRET_KEY, ADMIN_PASSWORD, GMAIL_PASS, Cloudinary keys) since the file has already left your machine.
- [ ] Remove `database/purpose.db`, `error_log.txt`, `tsconfig.tsbuildinfo`, `.env.local` from git tracking (`.gitignore` + `git rm --cached`).
- [ ] Decide: Razorpay or Manual-UPI-only. Remove the unused one (`RazorpayButton.tsx` + `/api/payment/verify` if dropping Razorpay).
- [ ] Decide: `/create`'s inline editor or the full `/editor` route. Delete/redirect the other, and delete root-level `ProposalEditor.jsx` (it's outside the Next.js build path anyway).
- [ ] Fix or remove the 3 broken `/preview/*` links on the Templates page.
- [ ] Delete `src/lib/mongodb.ts` (confirmed dead code).
- [ ] Turn Redis either fully on (real caching + real rate limiting store) or remove the stub/scaffolding to avoid confusion.
- [ ] Add basic uptime monitoring + error tracking (e.g., Sentry free tier) before real users touch it.
- [ ] Add a minimal smoke-test suite (at least: create proposal → save → verify link → view) so you don't ship regressions blind.

---

## 7. Path to "Enterprise-Grade" (beyond launch)

1. **Testing:** Add Jest for API route logic + Playwright for at least the core purchase funnel (create → pay → activate → view).
2. **CI/CD:** GitHub Actions pipeline — lint, type-check, test, build on every PR; auto-deploy to staging on merge to main.
3. **Observability:** Sentry (errors) + a proper structured logger (pino/winston) instead of raw `console.log`.
4. **Database:** Move fully to managed Postgres (Neon/Supabase/Railway) — never ship a local `.db` file. Add proper migration review process.
5. **Distributed rate limiting/caching:** Real Redis (Upstash is serverless-friendly) instead of in-memory maps — required the moment you're on more than one server instance.
6. **RBAC for admin:** Multiple admin accounts with roles, stored in the DB (`Admin` model already exists in your schema — actually use it instead of the single env-var login).
7. **API contracts:** OpenAPI spec + versioning (`/api/v1/...`) once you have external consumers or a mobile app planned.
8. **Secrets management:** Use your hosting platform's encrypted env vars (Vercel/Railway) — never keep a working `.env.local` in a shareable zip again.
9. **Documentation:** Architecture doc, onboarding doc for new engineers, and a real changelog instead of the informal `PROJECT_MASTER_VAULT.md` notes.
10. **Load & security testing:** Basic load test (k6/Artillery) and a dependency vulnerability scan before scaling ad spend or traffic.

---

*This report reflects a static code analysis at a single point in time — it does not include live runtime testing (actual payment gateway behavior, actual email delivery, actual DB connectivity under load).*
