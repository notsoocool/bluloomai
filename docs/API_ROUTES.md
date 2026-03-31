# BluLoomAI API Routes Plan

## Base: `/api`

---

### Instagram Integration

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/instagram/auth` | Initiate OAuth flow, redirect to Meta |
| GET | `/api/instagram/callback` | OAuth callback, exchange token, store account |
| POST | `/api/instagram/sync` | Fetch & upsert last 50 posts for connected account |
| GET | `/api/instagram/status` | Return connected account status |

---

### Analytics

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/analytics/summary` | Engagement metrics, top/bottom posts |
| GET | `/api/analytics/posting-times` | Best posting slots (top 3) |

---

### AI & Insights

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/analysis/run` | Run AI analysis on posts (idempotent) |
| GET | `/api/insights/viral-pattern` | Viral pattern comparison (top vs bottom) |

---

### Content Generation

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/generate/reel-script` | Generate reel script |
| POST | `/api/generate/caption` | Generate caption |
| POST | `/api/generate/hook` | Optimize hook |

---

### Webhooks (Future)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/webhooks/instagram` | Webhook verification |
| POST | `/api/webhooks/instagram` | Incoming webhook events |

---

## Auth

All routes except `/api/instagram/auth` and `/api/instagram/callback` require Clerk auth.

## Rate Limiting

- Sync: 1 req / 5 min per account
- Analysis: configurable per day
- Generation: configurable per day
