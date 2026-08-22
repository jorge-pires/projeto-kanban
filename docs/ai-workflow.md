# AI-assisted development workflow

AI can accelerate implementation, but the developer remains responsible for
scope, security and correctness.

## 1. Define the change

Write the expected behavior, files likely involved, behavior that must remain
unchanged and the verification method.

## 2. Provide focused context

Reference `AGENTS.md`, the affected files and their tests. Never attach `.env`,
database credentials, user records, tokens or production logs containing
personal data.

## 3. Ask for evidence

For diagnosis, request the direct cause, affected code and smallest correction.
For a feature, request a short plan before multi-file edits.

## 4. Review generated changes

Check every changed line for:

- authorization and validation at server boundaries;
- Server and Client Component separation;
- accessible labels, keyboard behavior and focus;
- unnecessary dependencies or abstractions;
- unrelated edits and hidden error suppression.

## 5. Verify locally

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Run `npm run test:coverage` before a pull request that changes domain or
security behavior.

## 6. Commit and review

Inspect `git diff`, stage only intended files and use a Conventional Commit in
English. Prefer a pull request over pushing directly to `main`.

## Stop conditions

Stop an AI-assisted change if it requests secrets, bypasses authorization,
edits generated Prisma code, removes tests to make CI pass, repeatedly retries
the same failure or expands the architecture without a requirement.
