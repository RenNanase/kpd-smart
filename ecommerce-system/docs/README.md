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

## PostgreSQL (`kpd-smart` database)

The API package connects with **`DATABASE_URL`** (standard PostgreSQL URI).

1. Create **`ecommerce-system/.env`** (gitignored). Copy fields from **`api/env.example`**.
2. Set your connection string, for example:
   `postgresql://USER:PASSWORD@HOST:5432/kpd-smart`
   - Replace `USER`, `PASSWORD`, `HOST` (e.g. `localhost`), and port if not `5432`.
   - **No password** (e.g. local `postgres` user with trust auth): use `postgresql://postgres@localhost:5432/kpd-smart` — no `:password` part.
   - If the password has `@`, `#`, etc., [URL-encode](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) those characters.
3. From `ecommerce-system/`, run **`npm run start:api`** and open **`http://localhost:3000/health/db`**. A JSON body with `ok: true` and `database: "kpd-smart"` means the app can reach your database.

`GET /health` checks only the Node process. `GET /health/db` runs `SELECT current_database(), now()` via `pg`.

### Seller products schema (CMS)

**Tables are created automatically** when you start the API (`npm run start:api`), unless you set **`SKIP_DB_MIGRATE=1`** in `.env`. You can also run migrations only with **`npm run migrate`** from `ecommerce-system/`.

The SQL in **`db/migrations/001_seller_products.sql`** (and any future `*.sql` in that folder, sorted by name) defines:

- **`products`** — name, description, selling/cost price, unit of measurement, optional discount % and fixed discount amount, optional SKU, video URL, rating (0–5), category id (optional), status.
- **`product_images`** — many image URLs per product (ordered), supporting 5+ images.

**API (Express)** under `api/`:

| Method | Path | Purpose |
|--------|------|--------|
| `GET` | `/api/products` | List products + image URLs |
| `GET` | `/api/products/:id` | One product |
| `POST` | `/api/products` | Create (JSON body) |
| `PATCH` | `/api/products/:id` | Update (JSON; send `imageUrls` to replace all images) |
| `DELETE` | `/api/products/:id` | Delete |
| `POST` | `/api/upload/media` | Multipart: fields `images` (multiple), `video` (optional); returns public URLs under `/uploads/…` |

The **admin** app (`admin-angular`) uses `environment.development.ts` → `apiBaseUrl: http://localhost:3000` when you `ng serve` (development configuration). Production builds use `environment.ts` — set `apiBaseUrl` to your deployed API origin.

The **React shop** still uses its own mock catalog types; wire it to this API in a later step if you want the storefront to match the seller CMS model.

## Future PostgreSQL REST API

- Keep REST path constants in `@ecommerce-system/api-contract`.
- Evolve `@ecommerce-system/types` with request/response shapes.
- Replace `@ecommerce-system/mock-data` usage with real HTTP clients pointing at the same paths and types.
- Add routes to `api/` and point the Angular/React apps at the API base URL (e.g. environment files).
