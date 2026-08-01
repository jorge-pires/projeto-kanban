# TaskFlow — AI Development Guidelines

## Project context

TaskFlow is a task management application built with Next.js,
TypeScript and Tailwind CSS.

## Code requirements

- Use TypeScript without `any`.
- Use the Next.js App Router.
- Keep Server Components as the default.
- Add `"use client"` only when browser interactivity is required.
- Preserve semantic HTML and accessibility.
- Reuse existing components before creating new ones.
- Do not install dependencies unless explicitly requested.
- Do not change unrelated files.
- Keep components focused and readable.
- Use English for code, file names and commit messages.
- Use Portuguese for visible interface text.

## Styling

- Use Tailwind CSS.
- Preserve the existing visual language.
- Use mobile-first responsive classes.
- Avoid arbitrary values when a standard Tailwind value exists.

## Validation

Before considering a task complete:

- Check TypeScript errors.
- Run lint when available.
- Test the affected interface.
- Report any unresolved errors.