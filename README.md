# Sync - Cloud Storage Migration Platform

Sync is a modern web application that enables seamless data migration between different cloud storage providers. Built with Next.js 16, it provides an intuitive interface for users to transfer files between Google Drive, Dropbox, and other cloud storage services.

## 🚀 Features

- **Multi-Cloud Support**: Migrate data between Google Drive, Dropbox, and more
- **OAuth Integration**: Secure authentication with cloud storage providers
- **Account Management**: Connect and manage multiple accounts per adapter
- **User Authentication**: Built with Better Auth for secure user sessions
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS v4 and shadcn/ui
- **Theme Support**: Light/dark mode with custom color palette using Montserrat font
- **Type-Safe**: Full TypeScript implementation with Prisma ORM

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.6](https://nextjs.org) with Turbopack and React 19.2.3
- **Database**: PostgreSQL with [Prisma ORM 7.4.0](https://www.prisma.io)
- **Authentication**: [Better Auth](https://better-auth.com) with email/password
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom theme variables
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) (Button, Command, Popover, Dialog, etc.)
- **Icons**: [Lucide React](https://lucide.dev)
- **Code Formatting**: Prettier with format-on-save

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (_root)/           # Main application routes
│   ├── (auth)/            # Authentication routes (login/register)
│   └── api/               # API routes (auth, adapters, OAuth callbacks)
├── components/
│   ├── auth/              # Authentication components
│   ├── custom/            # Custom components (AdapterSelection, ThemeToggle)
│   ├── layout/            # Layout components (FloatingSidebar)
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── auth.ts            # Better Auth configuration
│   ├── prisma.ts          # Prisma client setup
│   ├── with-auth.ts       # Auth middleware wrapper
│   └── api/               # API utilities (adapter management)
├── prisma/
│   ├── schema.prisma      # Database schema (User, Adapter, Session, etc.)
│   └── migrations/        # Database migrations
├── provider/              # Context providers (ThemeProvider)
├── utils/
│   ├── config/            # Configuration (adapter configs, API endpoints)
│   ├── constants/         # Route constants (protected/public routes)
│   └── functions/         # Utility functions (OAuth URLs, parsers)
├── proxy.ts               # Middleware for route protection
└── public/                # Static assets (logos, icons)
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User accounts with email authentication
- **Session**: User sessions managed by Better Auth
- **Account**: OAuth provider accounts linked to users
- **Adapter**: Cloud storage adapter connections (Google Drive, Dropbox)
- **AdapterAccountInfo**: Account metadata (email, name, avatar)

## 🔐 Authentication & Security

- **Better Auth** with Prisma adapter for session management
- **OAuth 2.0** flows for Google Drive and Dropbox
- **Protected routes** via middleware (`proxy.ts`)
- **Session tokens** stored securely with httpOnly cookies
- **CSRF protection** with `__Secure-sync` cookie prefix

## 🎨 Theming

The app uses a custom color palette with CSS variables:

- Primary: `#6d71f0`
- Background: `#fefefe` (light) / `#0f1117` (dark)
- Surface: `#f3f4f7` / `#1a1d29`
- Border: `#e5ebf4` / custom dark variants

Theme switching is handled via `ThemeProvider` with localStorage persistence.

## 🚦 Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn/pnpm/bun
- PostgreSQL database
- Google OAuth credentials (Client ID & Secret)
- Dropbox OAuth credentials (optional)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd prakash
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (create `.env`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sync"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_DRIVE_API_BASE_URL="https://www.googleapis.com"
GOOGLE_USERINFO_URL="https://www.googleapis.com/oauth2/v2/userinfo"
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Generate Prisma client:

```bash
npx prisma generate
```

6. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔌 API Routes

### Authentication

- `POST /api/auth/[...all]` - Better Auth endpoints (login, register, session)

### Adapters

- `GET /api/adapter/exists?adapterType=GOOGLE_DRIVE` - Check if adapter exists
- `GET /api/google/callback` - Google OAuth callback
- `GET /api/dropbox/callback` - Dropbox OAuth callback (if implemented)

## 🧩 Key Components

### AdapterSelection

Main migration interface component allowing users to:

- Select source and destination adapters
- Choose from existing connected accounts
- Add new cloud storage accounts
- Initiate migration between adapters

### ThemeProvider

Client-side theme management with:

- System preference detection
- Light/dark/system modes
- localStorage persistence

### FloatingSidebar

Navigation sidebar with workspace/account switching (v2 in development)

## 🌐 Supported Cloud Providers

- ✅ **Google Drive** (fully implemented)
- 🚧 **Dropbox** (OAuth integration in progress)
- 📋 **Planned**: OneDrive, Box, iCloud, Amazon S3, Google Photos

## 📝 Development Notes

- Uses Turbopack for faster builds
- Prettier formats code on save (configured in `.prettierrc`)
- Prisma client output is in `prisma/generated/prisma/`
- Protected routes are defined in `utils/constants/protected-route.ts`
- API endpoints are centralized in `utils/config/google-drive-endpoints.ts`

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Code is formatted with Prettier
- TypeScript has no errors
- Prisma migrations are included for schema changes

## 📄 License

This project is private and not licensed for public use.

---

Built with ❤️ using Next.js, Prisma, and Better Auth
