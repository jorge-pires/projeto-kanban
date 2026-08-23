# Reusable AI prompts

Replace every placeholder and attach only relevant files. Never provide secrets
or real user data.

## Explain code

```text
Explain [FILE OR COMPONENT] without changing it.

Cover its responsibility, inputs, state, server/client boundary, dependencies,
accessibility behavior and interaction with adjacent files. Use plain language
and identify one concrete example flow through the code.
```

## Diagnose an error

```text
Diagnose this error without editing code:
[ERROR]

Relevant files:
[FILES]

Return the direct cause, affected code, minimum correction and exact command or
behavior that verifies the correction. State what context is missing instead of
guessing. Do not install dependencies or suggest unrelated refactors.
```

## Implement a focused change

```text
Implement [FEATURE].

Allowed files:
[FILES]

Requirements:
[REQUIREMENTS]

Follow AGENTS.md. Preserve unrelated behavior, authorization, accessibility and
public component APIs. Before editing, provide a short plan. After editing, list
changed files and run the relevant tests, lint and type checking. Do not commit.
```

## Review generated changes

```text
Review this diff against AGENTS.md.

Classify findings as blocker, important or optional. For each real issue, give
the file, evidence, impact and smallest fix. Check data ownership, validation,
error handling, keyboard use, TypeScript, performance and test coverage. Do not
edit files and do not report style preferences as defects.
```
