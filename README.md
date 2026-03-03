# NyayaSetu (न्यायसेतु)  — Your Bridge to Justice

AI-powered legal navigation platform for Indian citizens. Helps users understand their legal issues, know their rights, find relevant government offices, and get AI-generated step-by-step action plans — in Hindi and English.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (React), Tailwind CSS   |
| Backend    | Node.js, Express, TypeScript       |
| Database   | PostgreSQL, Prisma ORM             |
| AI         | OpenAI GPT-4o-mini                 |
| State      | Zustand, TanStack Query            |
| Auth       | JWT + bcrypt                       |

---

## Project Structure

```
rozer/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/            # Pages (Home, Intake, Plan, Directory, Rights, Helplines, Login)
│   │   ├── components/     # Navbar, Footer, Providers
│   │   └── lib/            # API client, Zustand store, i18n
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # auth, categories, intake, plans, directory, rights, helplines
│   │   ├── services/       # AI service (OpenAI)
│   │   ├── middleware/      # JWT auth
│   │   ├── lib/            # Prisma client
│   │   ├── seed.ts         # Database seeder
│   │   └── index.ts        # Server entry
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── docs/                   # Product documentation
├── docker-compose.yml      # PostgreSQL container
└── package.json            # Monorepo scripts
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Docker** (for PostgreSQL) or a local PostgreSQL 15+ instance
- **OpenAI API key** (for AI features)

---

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Setup environment

The `.env` file in `server/` is pre-configured for local Docker PostgreSQL. Add your OpenAI API key:

```bash
# server/.env
OPENAI_API_KEY="sk-your-key-here"
```

### 4. Initialize database

```bash
cd server
npx prisma generate
npx prisma db push
npx tsx src/seed.ts
```

### 5. Run development servers

```bash
# From project root
npm run dev
```

This starts:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

---

## API Endpoints

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| GET    | `/api/health`                         | Health check                   |
| POST   | `/api/auth/register`                  | Register                       |
| POST   | `/api/auth/login`                     | Login (email+password or OTP)  |
| POST   | `/api/auth/guest`                     | Guest token                    |
| GET    | `/api/categories`                     | All legal categories           |
| GET    | `/api/categories/:id/questions`       | Intake questions               |
| POST   | `/api/intake/submit`                  | Submit + classify + plan       |
| POST   | `/api/intake/analyze`                 | Quick AI analysis              |
| GET    | `/api/plans/my-issues`                | User's issues                  |
| GET    | `/api/plans/issue/:issueId`           | Issue detail with plans        |
| PATCH  | `/api/plans/step/:stepId`             | Update step status             |
| GET    | `/api/directory/offices`              | Search offices                 |
| GET    | `/api/directory/states`               | Available states               |
| GET    | `/api/rights`                         | All rights by category         |
| GET    | `/api/helplines`                      | Emergency helplines            |

---

## Features

1. **AI Issue Classification** — Describe your issue in plain language; AI categorizes it and identifies applicable Indian laws
2. **Dual-Horizon Action Plans** — Short-term (7-14 day) and long-term (1-6 month) step-by-step plans
3. **Know Your Rights** — Browse legal rights by category with applicable laws, protections, and remedies
4. **Office Directory** — Search government offices, courts, legal aid centres by state/district
5. **Emergency Helplines** — Quick access to 112, 181, 1098, 1930, 15100 and more
6. **Hindi + English** — Full bilingual support with one-click toggle
7. **Step Tracking** — Mark action plan steps as complete to track your progress

---

## License

MIT
