# TaskFlow AI-Assisted Development Workflow

## 1. Understand the task

Before using AI:

- identify the expected behavior;
- locate the likely files;
- define what must not change;
- decide how the result will be tested.

## 2. Choose the smallest adequate tool

- Manual editing for trivial changes.
- Tab for predictable completion.
- Inline edit for localized changes.
- Chat for explanation and diagnosis.
- Agent for coordinated implementation.

## 3. Prepare the context

- Attach only relevant files.
- Never attach secrets.
- Reference project rules.
- State allowed files explicitly.

## 4. Review before implementation

For multi-file work:

- request a short plan;
- reject unnecessary dependencies;
- reject unrelated refactors;
- confirm the expected files.

## 5. Review generated code

- read every changed line;
- check imports and types;
- check Server and Client Component boundaries;
- check accessibility and security;
- confirm the scope.

## 6. Verify

Use the smallest adequate verification:

- visual test;
- responsive test;
- keyboard test;
- lint;
- build;
- database or authentication flow.

## 7. Commit manually

- inspect `git status`;
- inspect `git diff`;
- stage only intended files;
- use Conventional Commits in English;
- push only after verification.

## 8. Stop conditions

Stop the Agent when it:

- changes unrelated files;
- installs unapproved dependencies;
- repeats failed attempts;
- hides errors;
- proposes a larger architecture than requested;
- completes the requested behavior.