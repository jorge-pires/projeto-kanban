# TaskFlow development guide

## Purpose

TaskFlow is a portfolio-grade task manager built with Next.js, React,
TypeScript, Tailwind CSS, Auth.js, Prisma and Neon PostgreSQL.

## Required workflow

1. Read the affected files and their tests before editing.
2. Keep the change inside the requested scope.
3. Reuse existing components and domain functions.
4. Add or update focused tests for behavior that can regress.
5. Run `npm run check` and `npm run build` for application changes.
6. Review `git diff` before proposing a commit.

## Architecture boundaries

- `app/`: routes, layouts and Server Actions.
- `components/`: presentation and browser interaction.
- `lib/validations/`: Zod schemas at trust boundaries.
- `lib/tasks/`: framework-independent task domain rules.
- `lib/security/`: authentication protection and safe request metadata.
- `lib/services/`: external API clients with validation and fallbacks.
- `prisma/`: database schema and reviewed migrations.

Keep Server Components as the default. Add `"use client"` only for hooks,
browser APIs or direct interaction. Never import a Server Action into a shared
domain module.

## Security rules

- Treat Server Actions as public endpoints.
- Authenticate and authorize every mutation on the server.
- Scope database operations by the authenticated user.
- Validate untrusted input and external API responses with Zod.
- Never log passwords, tokens, secrets, raw IP addresses or connection URLs.
- Never expose server environment variables through `NEXT_PUBLIC_*`.
- Do not weaken CSP, rate limiting or ownership checks to fix another issue.
- Never edit an existing production migration; add a new migration.

## TypeScript and React

- Do not use `any` or suppress errors without a documented reason.
- Prefer explicit domain types and pure functions for business rules.
- Preserve immutable React state updates.
- Use semantic HTML, visible focus and accessible names.
- Support keyboard navigation and reduced motion.

## Styling and language

- Use Tailwind CSS with mobile-first responsive classes.
- Preserve the existing visual language and dark-mode support where present.
- Use English for code, files and commits.
- Use Brazilian Portuguese for visible interface text.

## Tests

- Prefer unit tests for validation, security and domain rules.
- Use component tests only for important interaction and accessibility.
- Mock network, database and authentication boundaries in unit tests.
- Do not assert implementation details when observable behavior is available.

## Commands

```bash
npm run dev
npm run check
npm run test:coverage
npm run build
npm run db:migrate
```

Use Conventional Commits in English, for example:
`fix(tasks): preserve order after moving a card`.
