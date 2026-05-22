---
name: project-skill-template
description: Use this template when creating a project-local Codex skill. Replace this description with clear trigger conditions and the task domain the skill supports.
---

# Project Skill Template

## When To Use

Use this skill when the user asks for:

- TODO: task type one
- TODO: task type two
- TODO: task type three

Do not use this skill for unrelated work.

## Workflow

1. Inspect the relevant project files first.
2. Follow the repository instructions in `AGENTS.md`.
3. Load only the reference files needed for the current request.
4. Prefer the project's existing patterns over new abstractions.
5. Validate the change with the commands listed below.

## References

- Read `references/domain-notes.md` when the task needs project-specific
  domain rules, examples, or API details.

## Scripts

- Put deterministic helper scripts in `scripts/`.
- Prefer running scripts over rewriting the same fragile logic repeatedly.

## Validation

Run the smallest useful validation for the change. For this project, start with:

```bash
node --check index.js
```
