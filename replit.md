# AI Growth Commerce

AI-native commerce for discovering the right tech setup, converting intent into safe checkout, and giving merchants actionable revenue intelligence.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ai-growth-commerce/src/App.tsx` — customer storefront, AI assistant, cart, checkout, and merchant cockpit routes
- `artifacts/ai-growth-commerce/src/index.css` — shared visual theme and responsive styles
- `artifacts/api-server/src/routes/commerce.ts` — product search, AI shopping actions, checkout, payment verification, merchant APIs, and audit state
- `lib/api-spec/openapi.yaml` — source of truth for the typed API contract
- `lib/db/src/schema/commerce.ts` — PostgreSQL schema for commerce entities

## Architecture decisions

- OpenAPI is the single API contract; the React Query client and server validation are generated from it.
- The first demo uses deterministic, server-side seeded commerce data so the hackathon flow remains usable without an external AI or payment credential.
- Payment actions are gated by server-calculated totals and an explicit confirmation step; failed payments preserve the cart.
- Product recommendations, upsells, and cross-sells are constrained by actual seeded inventory and merchant policy settings.

## Product

- Customer storefront with conversational product discovery, natural-language filters, comparison context, recommendations, upsells, cross-sells, cart actions, checkout, and test-mode payment verification.
- Merchant cockpit with revenue metrics, opportunities, human approval queue, campaign creation, policy controls, and an audit trail.

## User preferences

None recorded.

## Gotchas

- Merchant percentage metrics are represented as decimals in the API and formatted as percentages in the UI.
- The app runs through the shared proxy: customer requests use `/api/...`, not direct service ports.
- Re-run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
