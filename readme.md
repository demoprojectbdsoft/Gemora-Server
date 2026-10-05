<div align="center">

# ⚡ Electro — Server

### *The API powering the Electro electronics store.*

**A layered Express + MongoDB backend handling catalog, cart, orders, payments, reviews and users.**

[![Server Repo](https://img.shields.io/badge/Server-Repository-2ea44f?style=for-the-badge)](https://github.com/nihalxofficial/Electro-Server)
[![Client Repo](https://img.shields.io/badge/Client-Repository-blue?style=for-the-badge)](https://github.com/nihalxofficial/Electro-Electronic-store)
[![Internship Project](https://img.shields.io/badge/Type-Internship%20Project-orange?style=for-the-badge)]()

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Project Overview](#-project-overview)
  - [Objective](#objective)
  - [Platforms Used](#platforms-used)
- [Key Features](#-key-features)
- [API Modules](#-api-modules)
- [Tech Stack / npm Packages](#-npm-packages-used)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Future Roadmap](#-future-roadmap)
- [About This Project](#-about-this-project)

---

## 📖 About

Electro-Server is the dedicated backend API for the [Electro](https://github.com/nihalxofficial/Electro-Electronic-store) electronics e-commerce platform. It was built as a hands-on internship project to practice a real, layered Express architecture instead of a single-file prototype — every feature (categories, products, cart, wishlist, reviews, orders, transactions, users) lives in its own module, each split cleanly into **model → validator → service → controller → route**.

The backend owns none of the authentication state itself — the Next.js frontend handles sign-up/login via better-auth and exposes a JWKS endpoint, and this server verifies every protected request's JWT against that same JWKS. There's no shared secret between the two codebases and no duplicated user table; the backend keeps a read-mostly mirror of the user document for convenience (role, status, points, etc.) while better-auth remains the source of truth for identity.

**What makes it different from a typical CRUD API:**
- **Nothing about the catalog is hardcoded** — categories, subcategories, and products are fully data-driven, created and edited entirely through admin requests, so the same API could serve a completely different storefront just by changing the data.
- **Server-trusted money math, always** — price, discount percentage, shipping fee, order subtotal/total, and loyalty points earned are *never* accepted from the client; they are computed from the database on every read and every order creation.
- **Self-correcting product ratings** — a product's `rating` and `reviewCount` are not columns a client can drift out of sync; they're recalculated via aggregation from the actual `ProductReview` documents every time a review is created, updated, or deleted.
- **One real order pipeline, not a status flag** — placing an order validates stock for every item, creates the order, creates a linked transaction, writes the first order-status log entry, decrements stock, clears the user's cart, and credits loyalty points — as one coordinated service call, not scattered client-side steps.
- **Stateless, cross-service JWT auth** — protected routes are verified against the frontend's JWKS endpoint (`jose-cjs`, since the project runs as CommonJS), meaning the API can scale independently of the frontend with zero shared session state.
- **Deployed as a serverless function** — the same Express app runs locally as a long-lived server (`src/index.ts`) and in production as a Vercel serverless function (`api/index.ts`), reusing a single MongoDB connection across invocations.

---

## 🎯 Project Overview

### Objective
To build a production-shaped REST API for an e-commerce platform using a clean layered architecture, strict request validation, and backend-enforced business rules — while solving the real engineering problems that come with it: serverless deployment on Vercel, stateless JWT verification shared across two separate codebases, and keeping derived data (ratings, discounts, totals) always correct rather than trusted as stored state.

### Platforms Used
- **Runtime:** Node.js + Express.js 5 + TypeScript
- **Database:** MongoDB Atlas via Mongoose
- **Validation:** Zod, on every module
- **Auth:** JWT verification via the frontend's better-auth JWKS endpoint (`jose-cjs`)
- **Hosting:** Vercel Serverless Functions

---

## ✨ Key Features

- **Layered module architecture** — every feature (`category`, `subcategory`, `product`, `review`, `wishlist`, `cart`, `user`, `order`, `order-status`, `transaction`) follows the exact same `model → validator → service → controller → route` structure, so any module is predictable to read or extend.
- **Zod validation everywhere** — every write endpoint validates its payload with a dedicated Zod schema before it reaches a service.
- **JWT + role-based middleware** — `requireAuth` verifies the bearer token against the frontend's JWKS; `requireRole(...)` gates admin-only routes.
- **Full catalog hierarchy** — categories → subcategories → products, with cascade-safe deletes (a category/subcategory can't be deleted while products still reference it).
- **Cart & Wishlist as one-row-per-item** — a compound unique index on `{ userId, productId }` keeps exactly one row per item; the cart's subtotal and item count are computed live from current product prices, never stored.
- **Review-driven ratings** — `recalculateProductRating()` re-aggregates a product's rating and review count from its real reviews after every create/update/delete.
- **Full order lifecycle** — `createOrder()` validates stock, computes subtotal/shipping/total/points server-side, creates the `Order` + linked `Transaction`, logs the initial status via `OrderStatusLog`, decrements stock, clears the cart, and credits the user's loyalty points — in one service call.
- **Order status history** — every status transition (confirmed → processing → shipped → delivered/cancelled) is logged as its own document, giving a full audit trail per order.
- **Consistent API responses & error handling** — a shared `apiResponse` helper and a global `errorMiddleware` + `ApiError` class keep every endpoint's success/error shape identical.

---

## 🧩 API Modules

| Module | Responsibility |
|---|---|
| `category` | Top-level product categories (CRUD, cascade-delete guard) |
| `subcategory` | Subcategories nested under a category |
| `product` | Product catalog — pricing, stock, images, specs, badges, search/filter/sort/pagination |
| `review` | Per-product star ratings & written reviews; drives product rating recalculation |
| `wishlist` | Per-user saved products |
| `cart` | Per-user cart items with live-computed subtotal |
| `order` | Order placement and retrieval — the main checkout pipeline |
| `order-status` | Append-only status history log per order |
| `transaction` | Payment records linked to orders (COD or mobile wallet) |
| `user` | Read/update/delete access to the better-auth-managed user collection (role, status, points, profile fields) |

---

## 📦 npm Packages Used

| Package | Purpose |
|---|---|
| `express` | HTTP server & routing |
| `mongoose` / `mongodb` | MongoDB ODM / driver |
| `zod` | Request payload validation |
| `jose-cjs` | JWKS fetching & JWT verification (CommonJS-compatible) |
| `cors` | Cross-origin requests from the frontend |
| `dotenv` | Environment variable loading |
| `typescript` / `tsx` | Type safety & dev-time execution |
| `tsconfig-paths` | `@/` path alias resolution at runtime |

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string

# The frontend's origin — its /api/auth/jwks endpoint is used to verify JWTs
NEXT_PUBLIC_CLIENT_URL=your_frontend_app_url
```

> Never commit `.env` to version control.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/nihalxofficial/Electro-Server.git
cd Electro-Server

# Install dependencies
npm install

# Start development server (with live reload)
npm run dev
```

The API will be available at [http://localhost:5000](http://localhost:5000).

```bash
npm run build   # compile TypeScript to dist/
npm start       # run the compiled server
```

> Make sure the [Electro-Electronic-store](https://github.com/nihalxofficial/Electro-Electronic-store) frontend is running and reachable at `NEXT_PUBLIC_CLIENT_URL` — JWT verification depends on its `/api/auth/jwks` endpoint being live.

---

## 🗺️ Future Roadmap

- [ ] **Rider / delivery module** — a courier role with live location updates, powering real-time order tracking on the client.
- [ ] **"Lucky Box" rewards API** — endpoints for redeeming loyalty points on a gamified mystery-box reward.
- [ ] **Real-time store settings** — a settings module pushed to clients instantly (e.g. via websockets/SSE) instead of static config.
- [ ] **Chat module** — real-time messaging endpoints between customers and support/admin.
- [ ] **Coupons & promo codes** — a dedicated module for discount codes, validated and applied server-side at checkout.
- [ ] **Real payment gateway integration** — replacing the simulated OTP/wallet flow with an actual Stripe/SSLCommerz/bKash API integration, including webhooks.
- [ ] **Rate limiting & request logging** — hardening for production traffic.
- [ ] **Automated tests** — unit/integration coverage per module.

---

## 🎓 About This Project

This is an **internship project** built for learning and demonstration purposes — it is not distributed under an open-source license. Feel free to explore the code, but please reach out before reusing or redistributing it.
