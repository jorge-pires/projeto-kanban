# Contributing to TaskFlow

## Local setup

1. Install Node.js using the version declared in `.nvmrc`.
2. Run `npm ci`.
3. Copy `.env.example` to `.env`.
4. Generate a secure Auth.js secret with `npx auth secret`.
5. Run `npx prisma migrate dev`.
6. Start the application with `npm run dev`.

## Development standards

- Use TypeScript without `any`.
- Keep Server Components as the default.
- Validate untrusted data on the server.
- Preserve semantic HTML, keyboard access and visible focus.
- Add tests for behavior and domain rules, not implementation details.
- Never commit secrets or real user data.

## Before opening a pull request

Run:

```bash
npm run check
npm run build
```

Use Conventional Commits in English, for example:

```text
feat(tasks): add task filtering
fix(auth): prevent unauthorized project access
test(tasks): cover task ordering
docs: improve local setup
```
