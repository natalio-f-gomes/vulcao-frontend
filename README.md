# Vulcao Frontend

Client application for the Vulcao platform. Talks to the [Vulcao Backend](../backend/README.md) over HTTPS via CloudFront, and is itself served from S3 through the same (or a paired) CloudFront distribution.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Communication](#api-communication)
- [Authentication](#authentication)
- [Build & Deployment](#build--deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

The frontend is a client-rendered app that authenticates against the backend via an HTTP-only cookie, and calls REST endpoints under `/api/v1/**`. In production, all API traffic is routed through CloudFront alongside the static site, so requests never leave HTTPS and never trigger CORS preflight failures caused by protocol mismatches.

```
Browser
  │
  ├─ GET /            → CloudFront → S3 (static site)
  └─ POST /api/v1/... → CloudFront → ALB → Spring Boot backend
```

See the backend README's architecture section for the full request path diagram (`architecture.png`).

---

## Tech Stack

- React (or your specific framework — Vite/CRA/Next; update this line to match your actual setup)
- TypeScript
- Fetch API for HTTP requests
- Environment-based configuration (`.env.development`, `.env.production`)

---

## Project Structure

```
src/
├── api/
│   └── client.ts           # fetchAPIWithCredentials — shared fetch wrapper
├── components/
├── pages/
├── hooks/
└── ...

.env.development             # Local dev environment variables
.env.production               # Production build environment variables
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The backend running locally (see backend README) OR access to the deployed CloudFront URL

### Install and run

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` (or `5173` for Vite — adjust to match your setup).

### Build for production

```bash
npm run build
```

Outputs a static bundle (typically `dist/` or `build/`) ready to upload to the S3 bucket behind CloudFront.

---

## Environment Variables

The backend URL must **never** be hardcoded — it changes between local development and production, and will change again once a custom domain is set up. Use environment variables so the same codebase works everywhere without edits.

**`.env.development`**
```
VITE_BACKEND_URL=http://localhost:8080
```

**`.env.production`**
```
VITE_BACKEND_URL=https://d3t1pfq4hboj7a.cloudfront.net
```

> Replace the prefix (`VITE_`) with whatever your build tool requires: `NEXT_PUBLIC_` for Next.js, `REACT_APP_` for Create React App.

**Why this matters:**
- In dev, the backend runs on `localhost:8080` with no TLS — plain `http://` is fine because both frontend and backend are on `localhost`.
- In production, the frontend is served over HTTPS (via CloudFront). Browsers block any HTTP request from an HTTPS page ("mixed content"). The backend URL **must** be HTTPS in production — which is exactly what routing through CloudFront gives you, without needing a custom domain or a certificate on the ALB.
- When a custom domain is eventually added, only `.env.production` changes (`https://api.yourdomain.com`) — no code changes required.

**After changing any `.env` file, restart the dev server.** Vite and most bundlers only read `.env` files at startup.

---

## API Communication

All API calls should go through a single shared fetch wrapper so headers, credentials, and the base URL are consistent everywhere:

```ts
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchAPIWithCredentials(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  return await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
```

**Usage:**
```ts
const response = await fetchAPIWithCredentials("/api/v1/auth/user/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

if (!response.ok) {
  const errorBody = await response.json();
  throw new Error(errorBody.error ?? "Request failed");
}
```

**Why `credentials: "include"`:** the backend issues an HTTP-only `AUTH_TOKEN` cookie on login. `credentials: "include"` tells the browser to send that cookie on every subsequent request, and to accept `Set-Cookie` on cross-origin responses. This only works if the backend's CORS configuration explicitly allows the frontend's origin and sets `Access-Control-Allow-Credentials: true` — wildcard origins (`*`) are not permitted with credentials.

---

## Authentication

1. User submits the login form → `fetchAPIWithCredentials("/api/v1/auth/user/login", ...)`.
2. Backend validates credentials, returns a `Set-Cookie: AUTH_TOKEN=...; HttpOnly` header.
3. The browser stores the cookie automatically (JavaScript never sees the token — this is intentional, it protects against XSS token theft).
4. Every subsequent `fetchAPIWithCredentials` call automatically includes the cookie.
5. To check if a user is logged in, call a profile endpoint (e.g., `/api/v1/user/get/my-profile`) — a `401`/`403` means not authenticated, don't rely on client-side state alone as the source of truth for auth status.

**Logout**: call a backend logout endpoint that clears the cookie (`Set-Cookie: AUTH_TOKEN=; Max-Age=0`), rather than trying to delete the cookie from JavaScript — `HttpOnly` cookies aren't accessible to client-side code by design.

---

## Build & Deployment

The production build is a static bundle uploaded to an S3 bucket, served through CloudFront.

```bash
npm run build
aws s3 sync ./dist s3://vulcao-app --delete --region eu-south-2
```

After uploading, invalidate the CloudFront cache so users get the new build immediately instead of a cached version:

```bash
aws cloudfront create-invalidation \
  --distribution-id ESPECHW8A6GRU \
  --paths "/*"
```

> Invalidations aren't free at high volume — for frequent deploys, consider versioned asset filenames (most build tools do this by default with content hashes) so only `index.html` needs invalidating.

---

## Troubleshooting

### Requests hang forever / never resolve

Check the Network tab for the actual request URL:
- If it's `http://<alb-dns>.amazonaws.com/...` → `VITE_BACKEND_URL` is pointing at the ALB directly instead of CloudFront. Fix the env var.
- If it's `https://<cloudfront-domain>/...` and still hangs → check whether CloudFront's `/api/*` behavior exists and allows POST/PUT/DELETE (default CloudFront behaviors only allow GET/HEAD).

### Browser console shows "blocked: insecure content" / mixed content

The frontend (HTTPS) is calling the backend over plain HTTP. This is a hard browser rule — HTTPS pages cannot fetch HTTP resources. Point `BACKEND_URL` at the CloudFront HTTPS URL, not the ALB's HTTP URL.

### CORS error in console

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

The backend's `allowedOrigins` list doesn't include your frontend's origin. This is set server-side in `CORSConfig.java` — the frontend can't work around a CORS rejection, it has to be fixed on the backend.

### 403 on every request, even public endpoints

Usually one of:
- A stale/invalid `AUTH_TOKEN` cookie is being sent and something downstream is rejecting it — try an incognito window to rule this out.
- CloudFront's cache/origin-request policy isn't forwarding the necessary headers or cookies — should be `Managed-AllViewer` for the `/api/*` behavior.

### Login succeeds but subsequent requests act logged-out

Check that `credentials: "include"` is present on every request, and that the backend's CORS config has `allowCredentials(true)` with an explicit (non-wildcard) origin list.
