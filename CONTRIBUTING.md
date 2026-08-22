# Contributing

## Setup

Follow the local installation steps in `README.md`, then create a branch from
the latest `main`.

## Development rules

- Follow `AGENTS.md`.
- Keep one concern per pull request.
- Preserve server-side authorization and validation.
- Add focused tests for behavior with meaningful regression risk.
- Do not commit `.env`, database files, generated Prisma Client or coverage.

## Verification

```bash
npm run format:check
npm run check
npm run test:coverage
npm run build
```

## Commits

Use Conventional Commits in English:

```text
feat(tasks): add priority filter
fix(auth): preserve generic login errors
test(tasks): cover cross-column movement
docs(readme): explain local setup
```

## Pull requests

Describe the problem, solution, tests, accessibility impact and security impact.
Attach screenshots only when the interface changed. Never attach personal data
or secrets.
