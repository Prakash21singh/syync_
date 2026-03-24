# Sync

**Sync is a multi-cloud data orchestration platform** — a pipeline that moves data seamlessly between cloud storage providers like Google Drive, Dropbox, OneDrive, and more.

This repository is the **UI layer**. It handles authentication, account connections, and lets you configure migrations visually.
For the actual migration engine that runs the pipelines behind the scenes, see [Sync-Worker](#).

---

## How It Works

1. Connect your source and destination cloud storage accounts
2. Select what you want to migrate
3. Sync-Worker handles the rest — chunking, transferring, and verifying your data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + React 19 |
| Database | PostgreSQL + Prisma ORM |
| Auth | Better Auth (email/password + OAuth) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Language | TypeScript |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Google OAuth credentials

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, NEXT_PUBLIC_BASE_URL, and OAuth credentials

# Run database migrations
npx prisma migrate dev

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sync"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=""
GOOGLE_DRIVE_API_BASE_URL="https://www.googleapis.com"
GOOGLE_USERINFO_URL="https://www.googleapis.com/oauth2/v2/userinfo"
```

---

## Supported Providers

| Provider | Status |
|---|---|
| Google Drive | ✅ Available |
| Dropbox | 🚧 In Progress |
| OneDrive | 📋 Planned |
| Amazon S3 | 📋 Planned |

---

## Scripts

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Format with Prettier
```

---

## Related

- **[Sync-Worker](https://github.com/Prakash21singh/sync-worker)** — The background engine that powers all migrations