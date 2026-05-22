# Rate API Notes

The app currently fetches USD-based exchange rates from:

```text
https://open.er-api.com/v6/latest/USD
```

Expected useful fields:

```json
{
  "rates": {
    "RUB": 71.12217
  }
}
```

When changing providers, keep `/api/rate` returning this local shape:

```json
{
  "rate": 71.12217,
  "updatedAt": "2026-05-22T13:15:08.122Z",
  "source": "https://example.com"
}
```
