# Claude instructions

Follow `AGENTS.md` as the canonical project guide and
`.cursor/rules/taskflow.mdc` for editor-specific constraints.

Before changing code, inspect the affected route, component, domain module and
tests. Never expose secrets, bypass authorization, edit generated Prisma files
or modify an existing migration. Finish by running the smallest relevant test
set, then `npm run check` and `npm run build` when application behavior changes.
