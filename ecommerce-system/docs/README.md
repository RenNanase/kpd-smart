# E-commerce system monorepo

This workspace hosts two frontends and shared packages for API contracts, types, and mock REST clients.

## Layout

| Path | Role |
|------|------|
| `admin-angular/` | Angular admin application |
| `shop-react/` | React storefront (Vite) |
| `shared/types/` | Shared TypeScript types and DTOs |
| `shared/api-contract/` | REST paths, OpenAPI metadata, `openapi/openapi.yaml` stub |
| `shared/mock-data/` | `MockRestClient` and related fixtures |
| `docs/` | Architecture and onboarding notes |

## Commands

Run from `ecommerce-system/`:

- `npm install` — install all workspaces
- `npm run start:admin` — Angular dev server
- `npm run start:shop` — Vite dev server
- `npm run build` — build all packages that define `build`

## Future PostgreSQL REST API

- Keep REST path constants in `@ecommerce-system/api-contract`.
- Evolve `@ecommerce-system/types` with request/response shapes.
- Replace `@ecommerce-system/mock-data` usage with real HTTP clients pointing at the same paths and types.
