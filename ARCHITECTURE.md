# AI RECEIPT SHIELD — ARCHITECTURE & FILE DIVISION

This document delineates the architectural boundary between the **Frontend (Presentation & Client UX)** and the **Backend (API, Verification Engines, Database & Infrastructure)** while preserving Next.js App Router conventions.

---

## 🖥️ FRONTEND LAYER (Client-Side & Presentation)

All presentation logic, user experience flows, state machines, and visual components live here.

### 1. UI Components (`/components`)
| File | Responsibility |
|---|---|
| [`components/app-shell.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/components/app-shell.tsx) | Responsive navigation sidebar, role selector (Finance / Auditor / Employee / Admin), mobile drawer, and layout container. |
| [`components/evidence-graph.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/components/evidence-graph.tsx) | Interactive SVG node graph linking expense claims to independent corroborating rails (Merchant, Bank, Geolocation, Duplicate detection). |
| [`components/status-badge.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/components/status-badge.tsx) | Color-coded status indicator for Verified, Conflicting, Unverified, and Policy Exception states. |
| [`components/source-chip.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/components/source-chip.tsx) | Visual badge identifying corroborating data sources (Bank, Geolocation, Merchant Registry, Company Policy). |

### 2. Pages & Layouts (`/app`)
| Route / File | Type | Description |
|---|---|---|
| [`app/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/page.tsx) | Client Page | Public landing page with hero, value proposition, live stats, and direct verification CTA. |
| [`app/layout.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/layout.tsx) | Server/Client Layout | Root HTML layout configuring fonts (Inter / JetBrains Mono), SEO metadata, and global dark theme. |
| [`app/dashboard/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/dashboard/page.tsx) | Client Page | Executive dashboard with real-time KPIs, SVG status donut chart, category distribution bars, and priority queue. |
| [`app/verify/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/verify/page.tsx) | Client Page | Live receipt verification pipeline with drag-and-drop receipt tester and multi-stage verification animation. |
| [`app/claims/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/claims/page.tsx) | Client Page | All-claims directory with multi-field filtering (status, department, employee, amount). |
| [`app/claims/layout.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/claims/layout.tsx) | Server Layout | Sub-layout wrapper for claims queue. |
| [`app/claims/[id]/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/claims/[id]/page.tsx) | Client Page | In-depth claim audit console with AI extraction checks, interactive Evidence Graph, findings list, and approval actions. |
| [`app/case-file/[id]/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/case-file/[id]/page.tsx) | Client Page | Printable, export-ready compliance case file documenting complete corroborating evidence and audit trail. |
| [`app/employee/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/employee/page.tsx) | Client Page | Employee portal to track reimbursement status and view policy explanations without confrontation. |
| [`app/auditor/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/auditor/page.tsx) | Client Page | External auditor sampling and statistical compliance dashboard. |
| [`app/admin/page.tsx`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/admin/page.tsx) | Client Page | Administrative configuration console for company expense policies and rules. |

### 3. Styling & Presentation Utilities
| File | Responsibility |
|---|---|
| [`app/globals.css`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/globals.css) | Complete design system: Linear/Ramp-tier HSL dark surfaces, tabular numerics, badge styles, skeleton animations, and accessibility tokens. |
| [`lib/utils.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/lib/utils.ts) | UI utility functions (currency formatting `formatINR`, date formatting `formatDate`, `cn` class merger). |
| [`lib/constants.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/lib/constants.ts) | UI labels, non-accusatory explainer texts (`UNVERIFIED_EXPLAINER`), and badge color mappings. |
| [`public/`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/public) & [`app/favicon.ico`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/favicon.ico) | Static icon assets, logos, and favicons. |

---

## ⚙️ BACKEND LAYER (Server-Side, APIs, Engine & Database)

All database operations, server route handlers, entity resolution algorithms, and data access models live here.

### 1. API Route Handlers (`/app/api`)
| Endpoint / File | Method | Description |
|---|---|---|
| [`app/api/dashboard/route.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/api/dashboard/route.ts) | `GET` | Aggregates real-time verification metrics: counts, money-at-risk, category breakdowns, and recent decisions. |
| [`app/api/claims/route.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/api/claims/route.ts) | `GET` | Filterable claims endpoint supporting queries by `status`, `empId`, `category`, `dept`, and `amount` range. |
| [`app/api/claims/[id]/route.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/api/claims/[id]/route.ts) | `GET` | Fetches single claim graph: extraction data, corroborating evidence items, findings, and decision histories. |
| [`app/api/claims/[id]/decide/route.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/api/claims/[id]/decide/route.ts) | `POST` | Immutable audit log recorder: writes `APPROVE` / `REJECT` / `REQUEST_INFO` decision with evidence snapshot. |
| [`app/api/policy-rules/route.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/app/api/policy-rules/route.ts) | `GET` | Supplies active company expense policies, limits, and violation rules. |

### 2. Evidence Verification Engine (`/lib/engine`)
| File | Responsibility |
|---|---|
| [`lib/engine/synthesize.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/lib/engine/synthesize.ts) | Core multi-rail corroboration engine: correlates claims with ledger transactions, flight/hotel bookings, GSTIN merchant data, and geo-coordinates to synthesize final verification verdicts. |
| [`lib/engine/fuzzy-match.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/lib/engine/fuzzy-match.ts) | Levenshtein and token-based string similarity matching for merchant raw names against official government merchant registries. |
| [`lib/engine/types.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/lib/engine/types.ts) | Server-side data models and interfaces for evidence records, rule violations, and extraction payloads. |

### 3. Database & ORM Layer (`/prisma` & `/lib/db.ts`)
| File | Responsibility |
|---|---|
| [`prisma/schema.prisma`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/prisma/schema.prisma) | Relational data schema: `Employee`, `Merchant`, `Claim`, `Extraction`, `EvidenceItem`, `Finding`, `CaseFile`, `Decision`, `LedgerTxn`, `TravelBooking`. |
| [`lib/db.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/lib/db.ts) | Production-ready PrismaClient singleton preventing multiple instances during development hot-reloads. |
| [`prisma/seed.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/prisma/seed.ts) | Comprehensive enterprise test fixtures: employees, merchants, ledger records, travel bookings, and 21 sample claims. |
| `prisma/dev.db` | Local SQLite database file. |

---

## 🛠️ SHARED & INFRASTRUCTURE CONFIGURATION

Files orchestrating the fullstack runtime:

| File | Purpose |
|---|---|
| [`package.json`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/package.json) | Dependency definitions, scripts (`dev`, `build`, `lint`, `db:seed`, `db:reset`). |
| [`tsconfig.json`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/tsconfig.json) | TypeScript compiler options and `@/*` path mapping (`baseUrl: "."`). |
| [`next.config.ts`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/next.config.ts) | Next.js build and runtime configuration. |
| [`postcss.config.mjs`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/postcss.config.mjs) | PostCSS Tailwind CSS v4 build pipeline. |
| [`.env`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/.env) | Environment configuration (`DATABASE_URL="file:./prisma/dev.db"`). |
| [`eslint.config.mjs`](file:///c:/Users/bhara/AI%20RECEIPT%20SHIELD/eslint.config.mjs) | ESLint code quality rules. |
