# Account Dynamics — Deployment

Two production paths are supported:

- **A. Vercel + Neon** (primary, recommended) — serverless hosting + managed Postgres.
- **B. Self-hosted `next start` + local Postgres (systemd)** — the current setup on this
  machine (`deploy/account-dynamics.service`).

The code is already configured for both. Uploads use **Vercel Blob** when
`BLOB_READ_WRITE_TOKEN` is set, otherwise fall back to the local filesystem.
Rate limiting uses **Upstash Redis** when configured, otherwise an in-memory fallback.

---

## A. Vercel + Neon (primary)

### 1. Create the Neon database

1. Create a project at [neon.tech](https://neon.tech) (Postgres 16).
2. Copy the **pooled** connection string → `DATABASE_URL` and the **direct**
   connection string → `DIRECT_URL` from the Neon "Connection Details" panel.
   - Both need `?sslmode=require`; the pooled one also wants `&pgbouncer=true`.

### 2. Apply the schema to Neon (do NOT use `db push` in prod)

Migrations are committed under `prisma/migrations`. Apply them once:

```bash
# point Prisma at Neon for this one command
DATABASE_URL="<pooled-url>" DIRECT_URL="<direct-url>" npx prisma migrate deploy
```

Then seed the initial admin user + content:

```bash
DATABASE_URL="<pooled-url>" DIRECT_URL="<direct-url>" npm run db:seed
```

### 3. Push the repo to GitHub, then import into Vercel

1. `git remote add origin <repo-url>` and push.
2. In Vercel: **Add New Project → Import** the repo. Framework = Next.js (auto).
3. Build settings are inferred; `next build` is used, and the new
   `postinstall: "prisma generate"` runs automatically during install.

### 4. Set environment variables in Vercel

Copy values from `deploy/.env.vercel.example` into **Settings → Environment Variables**:
`NEXT_PUBLIC_APP_URL`, `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`,
`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `BLOB_READ_WRITE_TOKEN` (from Vercel Storage → Blob),
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, plus SMTP vars and
`UPLOADS_SIGNING_SECRET` if desired.

Then add Blob storage and Upstash Redis via **Storage** tabs (or use your own instances).

### 5. Deploy

Deploy (a production deployment triggers automatically on push to the default branch).
Verify:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<your-app>.vercel.app/
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<your-app>.vercel.app/api/contact \
  -H "Content-Type: application/json" -H "Origin: https://<your-app>.vercel.app" \
  -d '{"name":"T","email":"t@example.com","subject":"s","message":"m"}'
# expect 201
```

### Vercel notes / caveats

- **Uploads** now go to Vercel Blob (no local disk). The media library, image
  remote patterns, and CSP (`img-src`/`connect-src`) already allow
  `**.blob.vercel-storage.com`.
- **Rate limiting** uses Upstash globally; if Upstash vars are absent it degrades to
  per-instance in-memory (still works, just not global).
- **Prisma** is a proper global singleton; schema already has `DIRECT_URL`; no
  Edge-forced routes; logging is console-only (view in Vercel logs).

---

## B. Self-hosted (systemd) — current local production

Points to the local Postgres (`localhost:5433`). See `deploy/account-dynamics.service`.

```bash
# build with the correct public URL (inlined at build time)
NEXT_PUBLIC_APP_URL=http://localhost:3000 NEXTAUTH_URL=http://localhost:3000 npm run build

# stop any stale server on 3000, then install+start the service (as root)
sudo cp deploy/account-dynamics.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now account-dynamics
```

Management: `sudo systemctl status/restart account-dynamics`, `journalctl -u account-dynamics -f`.

---

## Verification before deploy

```bash
npm run typecheck   # 0 errors
npm run lint        # 0 errors (pre-existing warnings only)
npm test            # 54 passed
npm run build       # succeeds
```

---

## Environment variable reference

| Var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | client/build | real URL, inlined at build |
| `DATABASE_URL` | server | Neon **pooled** |
| `DIRECT_URL` | server | Neon **direct** (Prisma CLI/migrations) |
| `AUTH_SECRET`/`NEXTAUTH_SECRET` | server | must match; random 64-char |
| `AUTH_URL`/`NEXTAUTH_URL` | server | real URL |
| `BLOB_READ_WRITE_TOKEN` | server | Vercel Blob |
| `UPSTASH_REDIS_REST_URL`/`_TOKEN` | server | Upstash Redis |
| `SMTP_*`, `EMAIL_FROM` | server | for real email delivery |
| `UPLOADS_SIGNING_SECRET` | server | optional, falls back to NEXTAUTH_SECRET |
| `ADMIN_EMAIL`/`ADMIN_PASSWORD` | seed | bootstrap admin |
| `LOG_LEVEL` | server | default `info` |
