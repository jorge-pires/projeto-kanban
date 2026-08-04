# TaskFlow AI Prompt Library

This document contains reusable prompts for AI-assisted
development in the TaskFlow project.

Before using a prompt:

1. Replace every placeholder.
2. Attach only the relevant files.
3. Review the project rules.
4. Confirm the allowed scope.
5. Never include secrets or real passwords.
6. Review every generated change before committing.

## Explain a component

Use when you need to understand an existing component without
changing it.

```text
Analyze the following component:

[FILE OR COMPONENT]

Explain:

1. its responsibility;
2. its props and types;
3. its state and event handlers;
4. whether it is a Server or Client Component;
5. the most important Tailwind classes;
6. its dependencies;
7. common changes I may need to make.

Do not change any code.
Do not suggest optional refactors unless there is a real problem.


Use esse prompt no Chat.

Exemplo de adaptação:

```text
Analyze components/auth/register-form.tsx.

Explain:

1. its responsibility;
2. its controlled fields;
3. its validation order;
4. why it is a Client Component;
5. its accessibility attributes;
6. which parts will be replaced by server validation later.

Do not change any code.

## Review a file

```text
Review only:

[FILES]

Check:

- TypeScript errors;
- incorrect React or Next.js usage;
- accessibility problems;
- security issues;
- broken imports;
- unintended behavior;
- violations of the project rules.

For every issue, provide:

- severity;
- file;
- affected code;
- technical reason;
- minimum correction.

Classify each item as:

- real error;
- recommended improvement;
- optional preference.

Do not edit files.
Do not suggest unrelated refactors.


Esse formato obriga a IA a fornecer evidências.

---

# 9. Prompt para corrigir um erro

Adicione:

```md
## Diagnose an error

```text
Diagnose the following error without changing code:

[ERROR MESSAGE]

Relevant files:

[FILES]

Return:

1. the direct cause;
2. the affected file and code;
3. why the error happens;
4. the minimum correction;
5. how to verify the correction.

Do not install dependencies.
Do not change unrelated files.
If the supplied context is insufficient, state exactly what is missing.


Use primeiro no Chat.

Somente depois de entender o erro, aplique a correção manualmente, com `Ctrl + K` ou Agent.

---

# 10. Prompt para edição localizada

Adicione:

```md
## Localized edit

Use with inline editing on a selected block.

```text
Update only the selected code.

Objective:
[OBJECTIVE]

Requirements:
[REQUIREMENTS]

Preserve:
- the current public API;
- existing behavior not mentioned in the objective;
- TypeScript types;
- existing visual language;
- accessibility attributes.

Do not:
- install dependencies;
- create files;
- change unrelated code;
- add any;
- introduce optional refactors.


Esse prompt é ideal para `Ctrl + K`.

---

# 11. Prompt para uma funcionalidade com Agent

Adicione:

```md
## Implement a feature

```text
Implement:

[FEATURE]

Allowed files:
- [FILE 1]
- [FILE 2]
- [FILE 3]

Requirements:
- [REQUIREMENT 1]
- [REQUIREMENT 2]
- [REQUIREMENT 3]

Restrictions:
- follow AGENTS.md and Cursor project rules;
- use TypeScript without any;
- do not install dependencies;
- do not modify unrelated files;
- preserve existing component APIs unless explicitly required;
- do not commit;
- do not expose secrets.

Before editing:
1. inspect only the necessary files;
2. present a plan of no more than [NUMBER] steps;
3. wait for approval.

After editing:
1. list changed files;
2. run lint;
3. run build when routes, types or server code changed;
4. report unresolved errors;
5. do not perform additional improvements.


---

# 12. Prompt para revisar uma alteração do Agent

Adicione:

```md
## Review generated changes

```text
Review the current uncommitted changes.

Expected task:
[EXPECTED TASK]

Allowed files:
[ALLOWED FILES]

Check whether:

1. only allowed files were changed;
2. all requirements were implemented;
3. unrelated behavior was modified;
4. dependencies were added;
5. TypeScript any was introduced;
6. security or accessibility regressed;
7. tests, lint or build should be executed.

Do not edit anything.
Return a concise pass/fail checklist with evidence.


Esse prompt é especialmente útil depois de uma implementação em vários arquivos.

---

# 13. Prompt para escrever uma mensagem de commit

Adicione:

```md
## Suggest a commit message

```text
Analyze the staged Git diff and suggest one Conventional Commit
message in English.

Requirements:

- use lowercase;
- use the correct type;
- describe the actual change;
- do not mention AI or Cursor;
- keep the subject concise;
- do not run Git commands.

Also explain in one sentence why the selected commit type is correct.


O Cursor pode sugerir a mensagem.

Mas você continuará executando manualmente:

```bash
git commit -m "..."