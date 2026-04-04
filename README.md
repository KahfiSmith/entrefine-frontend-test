# Finance Dashboard Frontend

Lean Next.js App Router frontend for a finance/admin dashboard that reads transaction data from CSV and keeps the stack minimal.

## Overview

This repository is intended for:

- CSV-driven dashboard development
- Strictly typed React and server code
- Tailwind CSS v4 with reusable UI primitives
- Minimal architecture without auth, backend, or database
- Basic testing and linting already wired

## Tech Stack

| Category | Stack |
| --- | --- |
| Framework | Next.js `16.1.6` |
| UI Runtime | React `19` / React DOM `19` |
| Language | TypeScript `strict` |
| Styling | Tailwind CSS `v4` |
| UI Utilities | `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `framer-motion` |
| Validation | Zod |
| Data Source | Local CSV files in `data/` |
| Testing | Jest |
| Linting | ESLint |

## Features

- App Router baseline for the dashboard shell
- Reusable primitive components in `src/components/ui`
- Dedicated dashboard component area in `src/components/dashboard`
- App-level loading, error, and not-found states already scaffolded
- Local CSV dataset under `data/`

## Installation

### Requirements

- Node.js `20+`
- pnpm `10+`

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
pnpm dev
```

## Usage Guide

### Run locally

```bash
pnpm dev
```

The dev server runs with Turbopack.

### Build for production

```bash
pnpm build
pnpm start
```

### Run quality checks

```bash
pnpm lint
pnpm type-check
pnpm test
```

### Explore the current app surface

- `data/transactions.csv` contains the local dataset
- `src/components/dashboard` is the intended home for dashboard-specific UI

## Environment Configuration

Current value from `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm test
pnpm test:watch
```

## Project Structure

```text
.
├─ data/
├─ public/
├─ src/
│  ├─ app/
│  ├─ components/
│  │  ├─ dashboard/
│  │  └─ ui/
│  ├─ lib/
│  │  └─ utils/
│  └─ types/
└─ package.json
```

### Responsibility guide

- `src/app` and `src/app/api`: route boundaries only
- `src/components/ui`: reusable presentation primitives
- `src/components/dashboard`: dashboard-specific UI composition
- `src/lib`: utility and data-processing logic
- `src/types`: shared dashboard contracts
- `data`: raw CSV input files

## Documentation

Keep the repo simple and update this file when the structure or setup changes materially.

## Notes

- This repo is intentionally frontend-only.
- Data should stay local to CSV unless the scope explicitly changes.
- Avoid reintroducing auth, backend, or database layers unless the product requirements actually need them.
