# Agent Instructions

These instructions apply to the whole repository unless a deeper `AGENTS.md`
overrides them.

## Project

This is a small CommonJS Node.js HTTP server. Keep the app simple and avoid
adding dependencies unless the task clearly needs them.

## Commands

- Check syntax: `node --check index.js`
- Run locally: `node index.js`
- Open the app: `http://localhost:3000`

## Coding Guidelines

- Use built-in Node.js modules first.
- Keep route handling explicit and easy to read.
- Return JSON errors from API endpoints.
- Keep UI assets inline unless the app grows enough to need separate files.
- Do not commit generated files, local secrets, or dependency folders.

## Validation

Before finishing server changes, run:

```bash
node --check index.js
```

If the task changes behavior, also start the server and verify the affected
route with `curl`.
