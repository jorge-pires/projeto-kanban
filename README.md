# TaskFlow

TaskFlow is a responsive Kanban application for organizing projects and tasks. It was built as a production-minded portfolio project focused on accessibility, data ownership and maintainable frontend architecture.

[Open the live application](https://projeto-kanban-pi.vercel.app)

## Features

- Account registration and credentials authentication.
- Private projects scoped to their owner.
- Task creation, editing and deletion.
- Accessible drag-and-drop with pointer, touch and keyboard support.
- Search, priority filters and temporary sorting.
- Dashboard with productivity metrics.
- Calendar with Brazilian national holidays from BrasilAPI.
- Responsive, mobile-first interface.
- Loading, empty, not-found and error states.
- Server-side validation and automated unit tests.

## Technology

| Technology | Responsibility |
| --- | --- |
| Next.js App Router | Routing, Server Components, Server Actions and rendering |
| React | Interactive user interface |
| TypeScript | Static type safety |
| Tailwind CSS | Mobile-first styling |
| Prisma ORM | Database access and migrations |
| Auth.js | Authentication and session management |
| Zod | Runtime validation of forms and external API responses |
| dnd-kit | Accessible Kanban drag-and-drop |
| Vitest and Testing Library | Fast unit and component tests |
| BrasilAPI | Brazilian national holiday data |

## Architecture

TaskFlow uses Server Components for data loading and Client Components only where browser interaction is necessary. Server Actions validate form input, verify the authenticated user and restrict database operations by ownership.

```text
Browser
  -> Next.js pages and components
  -> Server Actions
  -> Zod validation and Auth.js authorization
  -> Prisma ORM
  -> Database
```

The holiday calendar is the only public external API integration. Responses are validated with Zod and cached by Next.js for 24 hours.

## Local development

### Requirements

- Node.js 22 or newer
- npm
- a PostgreSQL database, such as a free Neon project

### Installation

```bash
git clone https://github.com/jorge-pires/projeto-kanban.git
cd projeto-kanban
npm ci
cp .env.example .env
npx auth secret
npm run db:deploy
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `AUTH_SECRET` | Secret used by Auth.js to protect sessions and tokens |

Never commit the real values. Use `.env.example` only as documentation.

Create a free database at [Neon](https://neon.com), copy its pooled PostgreSQL
connection string to `DATABASE_URL`, and run `npm run db:deploy` once to create
the application tables.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run build
```

The `npm run check` command runs lint, TypeScript and unit tests together. GitHub Actions repeats the quality checks for pull requests and pushes to `main`.

## Security

Passwords are hashed with bcrypt. Mutations are validated on the server and database queries include the authenticated owner's identifier. Secrets stay in environment variables.

Please read [SECURITY.md](./SECURITY.md) before reporting a vulnerability.

No application can guarantee absolute security. TaskFlow follows defense-in-depth practices and keeps dependencies monitored with Dependabot.

## Accessibility

The interface includes semantic landmarks, visible keyboard focus, a skip link, touch-friendly controls, live status messages and reduced-motion support. The Kanban board can be operated with a keyboard.

## Project status

TaskFlow is under active development. The next production milestones include PostgreSQL persistence, stronger authentication abuse protection, security headers and broader authorization tests.

## Author

Developed by [Jorge Pires](https://github.com/jorge-pires).
