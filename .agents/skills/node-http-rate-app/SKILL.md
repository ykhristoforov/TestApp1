---
name: node-http-rate-app
description: Use when modifying this project's CommonJS Node.js HTTP currency-rate app, including server routes, the inline HTML UI, manual refresh behavior, and exchange-rate API handling.
---

# Node HTTP Rate App

## Workflow

1. Read `AGENTS.md` and `index.js`.
2. Keep the app dependency-free unless the user asks for a framework.
3. Use explicit routes in `http.createServer`.
4. Keep API responses JSON and HTML responses UTF-8.
5. Preserve manual refresh behavior on the page.

## Implementation Notes

- Main file: `index.js`
- Server port: `3000`
- Main page route: `/`
- Rate API route: `/api/rate`
- External rate source is configured in `RATE_API_URL`.
- Цветовая гамма должна быть в стиле moex.com

## Validation

Run:

```bash
node --check index.js
```

For behavioral changes, run the server and check:

```bash
curl -i http://127.0.0.1:3000/
curl -i http://127.0.0.1:3000/api/rate
```
