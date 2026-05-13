// Mock data + shared icons + utilities for Chico PR Readiness

// =============== TEAMS ===============
window.TEAMS = [
  { id: 'payments',  name: 'Payments',  manager: 'Priya Shah',    usage: 74, approvalH: 11, cycles: 1.6, acted: 67, guardrail: 'Stable', status: 'Leading',     stage: 3 },
  { id: 'growth',    name: 'Growth',    manager: 'Marcus Lee',    usage: 62, approvalH: 14, cycles: 1.8, acted: 59, guardrail: 'Stable', status: 'Improving',   stage: 2 },
  { id: 'platform',  name: 'Platform',  manager: 'Elena Torres',  usage: 24, approvalH: 31, cycles: 2.7, acted: 28, guardrail: 'Watch',  status: 'Behind',      stage: 1 },
  { id: 'data',      name: 'Data',      manager: 'Omar Khan',     usage: 22, approvalH: 29, cycles: 2.6, acted: 26, guardrail: 'Stable', status: 'Holding',     stage: 1 },
];

// =============== PRs ===============
window.PRS = [
  {
    id: 184,
    title: 'Add retry logic to billing webhook',
    repo: 'payments-api',
    author: 'Maya Chen',
    team: 'Payments',
    teamId: 'payments',
    readiness: 'warn', // warn / good / risk / blocked
    score: 72,
    suggestions: 5,
    accepted: 3, declined: 1, ignored: 1,
    reviewStatus: 'Waiting',
    opened: '4h ago',
    branch: 'feature/billing-webhook-retries',
    linkedIssue: 'PAY-431 — Webhook retries fail during duplicate delivery',
  },
  {
    id: 178,
    title: 'Add idempotency keys to subscription renewal',
    repo: 'payments-api',
    author: 'Maya Chen',
    team: 'Payments',
    teamId: 'payments',
    readiness: 'warn',
    score: 84,
    suggestions: 2,
    accepted: 1, declined: 0, ignored: 1,
    reviewStatus: 'Waiting',
    opened: '1d ago',
    branch: 'feature/subscription-idempotency',
    linkedIssue: 'PAY-418 — Duplicate subscription renewals',
  },
  {
    id: 176,
    title: 'Fix webhook signature validation',
    repo: 'payments-api',
    author: 'Maya Chen',
    team: 'Payments',
    teamId: 'payments',
    readiness: 'good',
    score: 94,
    suggestions: 1,
    accepted: 1, declined: 0, ignored: 0,
    reviewStatus: 'Approved',
    opened: '2d ago',
    branch: 'fix/webhook-signature',
    linkedIssue: 'PAY-402 — Stripe webhook signature mismatch on retry',
  },
  {
    id: 182,
    title: 'Improve dashboard loading state',
    repo: 'growth-web',
    author: 'Theo Martin',
    team: 'Growth',
    teamId: 'growth',
    readiness: 'good',
    score: 91,
    suggestions: 2,
    accepted: 2, declined: 0, ignored: 0,
    reviewStatus: 'Approved',
    opened: '9h ago',
  },
  {
    id: 180,
    title: 'Refactor auth middleware',
    repo: 'platform-core',
    author: 'Sam Rivera',
    team: 'Platform',
    teamId: 'platform',
    readiness: 'risk',
    score: 58,
    suggestions: 6,
    accepted: 1, declined: 2, ignored: 3,
    reviewStatus: 'Changes requested',
    opened: '1d ago',
  },
  {
    id: 179,
    title: 'Add customer export endpoint',
    repo: 'data-services',
    author: 'Lina Patel',
    team: 'Data',
    teamId: 'data',
    readiness: 'warn',
    score: 69,
    suggestions: 4,
    accepted: 1, declined: 0, ignored: 1,
    reviewStatus: 'Waiting',
    opened: '7h ago',
  },
];

// =============== Suggestions for PR #184 ===============
window.PR184_SUGGESTIONS = [
  {
    id: 1,
    category: 'Missing test',
    severity: 'High',
    title: 'Add regression test for duplicate webhook delivery',
    explanation: 'This PR changes retry behavior, but does not test duplicate webhook events. A duplicate event could enqueue multiple retries for the same payment.',
    change: 'Add a test that sends the same failed webhook twice and confirms only one retry job is created.',
    file: 'tests/billingWebhookHandler.test.ts',
    lineMarker: { line: 7, label: '1' },
    isCode: false,
  },
  {
    id: 2,
    category: 'Edge case',
    severity: 'Medium',
    title: 'Guard against missing payment before retry enqueue',
    explanation: 'The handler returns when payment is missing, but does not record enough context to investigate repeated webhook failures.',
    change: 'Include event.id, paymentId, and provider status in the warning log.',
    file: 'src/webhooks/billingWebhookHandler.ts',
    lineMarker: { line: 4, label: '2' },
    isCode: false,
  },
  {
    id: 3,
    category: 'PR context',
    severity: 'Medium',
    title: 'Explain why retry count changed from 3 to 5',
    explanation: 'The PR changes retry behavior, but the description does not explain the reason or expected impact. Human reviewers may ask for product or ops context.',
    change: 'Retry count increased from 3 to 5 after billing ops reported transient provider failures during peak webhook volume.',
    file: 'PR description',
    isCode: true,
  },
  {
    id: 4,
    category: 'Potential logic issue',
    severity: 'High',
    title: 'Payment status may update before retry succeeds',
    explanation: 'The code updates payment status after enqueueing a retry. If the retry queue fails, the payment may still be marked failed without a retry job being created.',
    change: 'Wrap retry enqueue and status update in a transaction or explicitly handle enqueue failure.',
    file: 'src/webhooks/billingWebhookHandler.ts',
    lineMarker: { line: 12, label: '4' },
    isCode: false,
  },
  {
    id: 5,
    category: 'Reviewer context',
    severity: 'Low',
    title: 'Add reviewer note for billing reconciliation impact',
    explanation: 'This change may affect how billing operations investigate failed payments. Add a note so reviewers know to check reconciliation assumptions.',
    change: 'Please verify retry behavior against billing reconciliation dashboard assumptions.',
    file: 'PR description',
    isCode: false,
  },
];

// score deltas
window.SCORE_DELTAS = {
  High:   { accept: 7, fix: 9, decline: 0 },
  Medium: { accept: 5, fix: 6, decline: 0 },
  Low:    { accept: 2, fix: 3, decline: 0 },
};

// =============== Icons (lucide-style, minimal) ===============
window.Icon = function Icon({ name, className, style }) {
  const cls = className || 'ic';
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
    queue:     <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    code:      <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    manager:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    chart:     <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6"  y1="20" x2="6"  y2="14"/></>,
    sparkles:  <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>,
    spark:     <><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2z"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    chevR:     <><polyline points="9 18 15 12 9 6"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    copy:      <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    external:  <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    user:      <><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 14 0v1"/></>,
    bell:      <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    arrow:     <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    up:        <><polyline points="6 15 12 9 18 15"/></>,
    down:      <><polyline points="6 9 12 15 18 9"/></>,
    info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="12" y1="12" x2="12" y2="16"/></>,
    flag:      <><path d="M4 22V4a1 1 0 0 1 1-1h13l-3 5 3 5H5"/></>,
    bug:       <><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M16 10h3M5 10h3M16 14h3M5 14h3M16 18h3M5 18h3M9 6V3M15 6V3"/></>,
    book:      <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    git:       <><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M6 9v6a3 3 0 0 0 3 3h0M18 9v0a3 3 0 0 1-3 3h-3"/></>,
    file:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    play:      <><polygon points="5 3 19 12 5 21 5 3"/></>,
    eye:       <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    target:    <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    layers:    <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    zap:       <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    msg:       <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    refresh:   <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    monogram:  <><path d="M12 3a9 9 0 1 0 9 9"/><circle cx="12" cy="12" r="3" /></>,
  };
  return (
    <svg className={cls} style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

// readiness label
window.readinessLabel = function readinessLabel(r) {
  return ({good: 'Ready', warn: 'Needs attention', risk: 'Risky', blocked: 'Blocked'})[r] || r;
};
window.readinessPillClass = function readinessPillClass(r) {
  return ({good: 'pill-good', warn: 'pill-warn', risk: 'pill-risk', blocked: 'pill-risk'})[r] || 'pill-neutral';
};
window.readinessFromScore = function readinessFromScore(s) {
  if (s >= 90) return 'good';
  if (s >= 70) return 'warn';
  if (s >= 50) return 'risk';
  return 'blocked';
};

// tween helper
window.tweenNumber = function tweenNumber(from, to, durationMs, onTick, onDone) {
  const start = performance.now();
  const diff = to - from;
  function frame(now) {
    const t = Math.min(1, (now - start) / durationMs);
    // easeOutCubic + tiny overshoot at end
    let eased;
    if (t < 0.85) {
      const u = t / 0.85;
      eased = 1 - Math.pow(1 - u, 3);
      eased = eased * 1.04; // overshoot
    } else {
      const u = (t - 0.85) / 0.15;
      eased = 1.04 - 0.04 * u;
    }
    const v = from + diff * eased;
    onTick(Math.round(v));
    if (t < 1) requestAnimationFrame(frame);
    else { onTick(to); onDone && onDone(); }
  }
  requestAnimationFrame(frame);
};

// =============== Per-PR files + suggestions ===============
// File contents as plain strings (newline separated). Renderer handles styling.
window.PR_FILES = {
  184: [
    {
      name: 'src/webhooks/billingWebhookHandler.ts',
      code: `export async function handleBillingWebhook(event: BillingEvent) {
  const payment = await findPayment(event.paymentId)
  if (!payment) {
    logger.warn(\`Payment not found: \${event.paymentId}\`)
    return
  }

  if (event.status === 'failed') {
    await retryQueue.add({
      paymentId: payment.id,
      retryCount: 5,
      reason: event.failureReason
    })
  }

  await updatePaymentStatus(payment.id, event.status)
}`,
    },
    {
      name: 'src/services/retryQueue.ts',
      code: `import { Queue } from './queue'

export const retryQueue = new Queue<RetryJob>({
  name: 'billing-retry',
  concurrency: 4,
  backoff: { type: 'exponential', delay: 2000 },
})

retryQueue.process(async (job) => {
  await retryBillingEvent(job.data)
})`,
    },
    {
      name: 'tests/billingWebhookHandler.test.ts',
      code: `describe('handleBillingWebhook', () => {
  it('enqueues retry on failed status', async () => {
    const event = mockEvent({ status: 'failed' })
    await handleBillingWebhook(event)
    expect(retryQueue.size()).toBe(1)
  })

  it('warns when payment missing', async () => {
    const event = mockEvent({ paymentId: 'missing' })
    await handleBillingWebhook(event)
    expect(logger.warn).toHaveBeenCalled()
  })
})`,
    },
    {
      name: 'PR description',
      isDescription: true,
      code: `Adds retry handling for failed billing webhook events.
Updates retry count from 3 to 5.
Adds basic logging for failed attempts.`,
    },
  ],
  178: [
    {
      name: 'src/billing/subscriptionRenewal.ts',
      code: `export async function renewSubscription(subId: string, idempotencyKey: string) {
  const existing = await idempotencyStore.get(idempotencyKey)
  if (existing) return existing.result

  const result = await chargeRenewal(subId)
  await idempotencyStore.put(idempotencyKey, result)
  return result
}`,
    },
    {
      name: 'tests/subscriptionRenewal.test.ts',
      code: `describe('renewSubscription', () => {
  it('returns existing result for same idempotency key', async () => {
    const r1 = await renewSubscription('sub_1', 'key_1')
    const r2 = await renewSubscription('sub_1', 'key_1')
    expect(r2).toEqual(r1)
    expect(chargeRenewal).toHaveBeenCalledTimes(1)
  })
})`,
    },
    {
      name: 'PR description',
      isDescription: true,
      code: `Adds idempotency keys to subscription renewal flow.
Prevents duplicate charges when retried by webhook.`,
    },
  ],
  176: [
    {
      name: 'src/webhooks/signature.ts',
      code: `export function verifyWebhookSignature(payload: string, header: string, secret: string) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex')

  const provided = header.replace(/^sha256=/, '')
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(provided, 'hex')
  )
}`,
    },
    {
      name: 'tests/signature.test.ts',
      code: `describe('verifyWebhookSignature', () => {
  it('rejects payloads with mismatched signature', () => {
    const valid = sign(payload, secret)
    expect(verifyWebhookSignature(payload, valid, secret)).toBe(true)
    expect(verifyWebhookSignature('tampered', valid, secret)).toBe(false)
  })
})`,
    },
    {
      name: 'PR description',
      isDescription: true,
      code: `Fixes constant-time comparison for webhook signature.
Switches from string equality to crypto.timingSafeEqual.`,
    },
  ],
  182: [
    {
      name: 'src/components/Dashboard.tsx',
      code: `import { useEffect, useState } from 'react'
import { fetchDashboardMetrics } from '../api/metrics'
import { SkeletonCard } from './SkeletonCard'

export function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardMetrics().then(m => {
      setMetrics(m)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="dashboard-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="dashboard-grid">
      {metrics.cards.map(c => <MetricCard key={c.id} card={c} />)}
    </div>
  )
}`,
    },
    {
      name: 'src/components/SkeletonCard.tsx',
      code: `export function SkeletonCard() {
  return (
    <div className="metric-card skeleton" aria-hidden="true">
      <div className="skeleton-line w-40" />
      <div className="skeleton-line w-80 mt-8" />
      <div className="skeleton-line w-60 mt-6" />
    </div>
  )
}`,
    },
    {
      name: 'tests/Dashboard.test.tsx',
      code: `describe('Dashboard', () => {
  it('renders skeleton cards while loading', () => {
    render(<Dashboard />)
    expect(screen.getAllByRole('presentation')).toHaveLength(3)
  })
})`,
    },
    {
      name: 'PR description',
      isDescription: true,
      code: `Replaces the spinner on the dashboard with skeleton cards.
Reduces perceived load time and avoids layout shift when metrics arrive.`,
    },
  ],
  180: [
    {
      name: 'src/middleware/auth.ts',
      code: `import { verifyToken } from '../auth/jwt'
import { getSession } from '../auth/session'

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'missing_token' })

  const payload = verifyToken(token)
  const session = await getSession(payload.sub)

  req.user = session.user
  req.scopes = payload.scopes
  next()
}`,
    },
    {
      name: 'src/auth/session.ts',
      code: `import { redis } from '../infra/redis'

export async function getSession(userId: string) {
  const raw = await redis.get(\`session:\${userId}\`)
  return JSON.parse(raw)
}`,
    },
    {
      name: 'tests/auth.test.ts',
      code: `describe('authMiddleware', () => {
  it('rejects requests without a token', async () => {
    const res = mockRes()
    await authMiddleware(mockReq({}), res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
  })
})`,
    },
    {
      name: 'PR description',
      isDescription: true,
      code: `Refactors auth middleware to centralize token verification.
Splits session lookup into its own module.`,
    },
  ],
  179: [
    {
      name: 'src/api/exportCustomers.ts',
      code: `import { Router } from 'express'
import { db } from '../db'
import { toCsv } from '../util/csv'

export const exportRouter = Router()

exportRouter.get('/customers.csv', async (req, res) => {
  const rows = await db.customers.findAll()
  const csv = toCsv(rows)
  res.setHeader('Content-Type', 'text/csv')
  res.send(csv)
})`,
    },
    {
      name: 'src/util/csv.ts',
      code: `export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map(h => String(row[h] ?? '')).join(','))
  }
  return lines.join('\\n')
}`,
    },
    {
      name: 'tests/exportCustomers.test.ts',
      code: `describe('GET /customers.csv', () => {
  it('returns a CSV with one row per customer', async () => {
    const res = await request(app).get('/customers.csv')
    expect(res.status).toBe(200)
    expect(res.text.split('\\n').length).toBeGreaterThan(1)
  })
})`,
    },
    {
      name: 'PR description',
      isDescription: true,
      code: `Adds a /customers.csv endpoint for the data team to export customer records.
Streams the full table without pagination.`,
    },
  ],
};

// Suggestions per PR, file-anchored. Each has: id, file, category, severity, title, explanation, change, lineHint?, isCode?
window.PR_SUGGESTIONS = {
  184: [
    { id: 1, file: 'tests/billingWebhookHandler.test.ts', category: 'Missing test', severity: 'High',
      title: 'Add regression test for duplicate webhook delivery',
      explanation: 'This PR changes retry behavior, but does not test duplicate webhook events. A duplicate event could enqueue multiple retries for the same payment.',
      change: 'Add a test that sends the same failed webhook twice and confirms only one retry job is created.', isCode: false },
    { id: 2, file: 'src/webhooks/billingWebhookHandler.ts', category: 'Edge case', severity: 'Medium',
      title: 'Guard against missing payment before retry enqueue',
      explanation: 'The handler returns when payment is missing, but does not record enough context to investigate repeated webhook failures.',
      change: 'Include event.id, paymentId, and provider status in the warning log.', isCode: false, lineHint: 4 },
    { id: 3, file: 'PR description', category: 'PR context', severity: 'Medium',
      title: 'Explain why retry count changed from 3 to 5',
      explanation: 'The PR changes retry behavior, but the description does not explain the reason or expected impact. Human reviewers may ask for product or ops context.',
      change: 'Retry count increased from 3 to 5 after billing ops reported transient provider failures during peak webhook volume.', isCode: true },
    { id: 4, file: 'src/webhooks/billingWebhookHandler.ts', category: 'Potential logic issue', severity: 'High',
      title: 'Payment status may update before retry succeeds',
      explanation: 'The code updates payment status after enqueueing a retry. If the retry queue fails, the payment may still be marked failed without a retry job being created.',
      change: 'Wrap retry enqueue and status update in a transaction or explicitly handle enqueue failure.', isCode: false, lineHint: 16 },
    { id: 5, file: 'PR description', category: 'Reviewer context', severity: 'Low',
      title: 'Add reviewer note for billing reconciliation impact',
      explanation: 'This change may affect how billing operations investigate failed payments. Add a note so reviewers know to check reconciliation assumptions.',
      change: 'Please verify retry behavior against billing reconciliation dashboard assumptions.', isCode: false },
  ],
  178: [
    { id: 1, file: 'tests/subscriptionRenewal.test.ts', category: 'Missing test', severity: 'Medium',
      title: 'Add test for concurrent renewals with same key',
      explanation: 'The idempotency store handles sequential calls, but the test does not cover the case of two concurrent calls racing on the same key.',
      change: 'Add a test that fires two renewSubscription calls in parallel and asserts a single charge.', isCode: false },
    { id: 2, file: 'src/billing/subscriptionRenewal.ts', category: 'Edge case', severity: 'Low',
      title: 'Surface idempotency-store write failures',
      explanation: 'If the idempotency store write fails after charging, the next retry will charge again. Currently the failure is swallowed.',
      change: 'Catch the put() rejection, log it with subId and key, and surface a structured error to the caller.', isCode: false, lineHint: 6 },
  ],
  176: [
    { id: 1, file: 'PR description', category: 'Reviewer context', severity: 'Low',
      title: 'Note breaking-change risk for old payload format',
      explanation: 'The fix is correct but reviewers should know there is no breaking-change risk for existing providers.',
      change: 'Add: "No payload format change. Affects signature comparison only; backwards compatible."', isCode: true },
  ],
  182: [
    { id: 1, file: 'src/components/Dashboard.tsx', category: 'Accessibility', severity: 'Medium',
      title: 'Mark skeleton placeholders as non-interactive for screen readers',
      explanation: 'Skeleton cards are visual-only placeholders, but they currently sit in the same DOM position as real cards without an aria role. Screen readers will announce them.',
      change: 'Add role="presentation" and aria-busy="true" on the loading wrapper.', isCode: false, lineHint: 16 },
    { id: 2, file: 'tests/Dashboard.test.tsx', category: 'Missing test', severity: 'Low',
      title: 'Add test that skeleton clears once metrics resolve',
      explanation: 'The current test only asserts the loading state. There is no coverage for the transition into the loaded state.',
      change: 'Add a test that awaits the metrics promise and asserts MetricCard nodes render.', isCode: false },
    { id: 3, file: 'PR description', category: 'PR context', severity: 'Low',
      title: 'Mention the perceived-load metric this targets',
      explanation: 'Reviewers from the design system team will likely ask which metric this is intended to improve.',
      change: 'Add: "Targets Largest Contentful Paint on /dashboard, currently 1.8s p75."', isCode: true },
  ],
  180: [
    { id: 1, file: 'src/middleware/auth.ts', category: 'Potential logic issue', severity: 'High',
      title: 'verifyToken can throw — wrap in try/catch',
      explanation: 'verifyToken throws on invalid or expired tokens. The current code lets the error propagate, which returns a 500 to the client instead of a 401.',
      change: 'Wrap verifyToken in try/catch and return 401 with error: "invalid_token" on failure.', isCode: false, lineHint: 9 },
    { id: 2, file: 'src/auth/session.ts', category: 'Edge case', severity: 'High',
      title: 'getSession returns null for missing sessions but JSON.parse(null) fails',
      explanation: 'If redis.get returns null (session expired or never existed), JSON.parse(null) returns null silently — but downstream code reads session.user and crashes with an unhelpful stack trace.',
      change: 'Return null explicitly when raw is falsy, and have authMiddleware respond 401 when session is null.', isCode: false, lineHint: 5 },
    { id: 3, file: 'tests/auth.test.ts', category: 'Missing test', severity: 'Medium',
      title: 'Add test for expired token path',
      explanation: 'No test covers the case where verifyToken throws. This is the most common failure mode in production.',
      change: 'Mock verifyToken to throw and assert a 401 response with the expected error code.', isCode: false },
    { id: 4, file: 'PR description', category: 'Reviewer context', severity: 'Medium',
      title: 'Call out the session shape change',
      explanation: 'This PR moves session lookup out of the middleware. Anyone touching session data should know where it now lives.',
      change: 'Add: "Session retrieval moved from auth.ts to auth/session.ts. No behavior change for callers."', isCode: true },
  ],
  179: [
    { id: 1, file: 'src/api/exportCustomers.ts', category: 'Potential logic issue', severity: 'High',
      title: 'Loading the full customer table into memory will OOM at scale',
      explanation: 'db.customers.findAll() loads every row before any bytes are sent. With the production dataset (~2M rows) this will exceed the Node heap.',
      change: 'Stream rows via a cursor and pipe directly into the response.', isCode: false, lineHint: 8 },
    { id: 2, file: 'src/api/exportCustomers.ts', category: 'Security', severity: 'High',
      title: 'Endpoint has no authentication or authorization check',
      explanation: 'The /customers.csv route is mounted without any auth guard. Customer data should be restricted to authorized internal users.',
      change: 'Add the existing requireRole("data-admin") middleware to this route.', isCode: false, lineHint: 7 },
    { id: 3, file: 'src/util/csv.ts', category: 'Edge case', severity: 'Medium',
      title: 'Values containing commas or quotes will break the CSV',
      explanation: 'toCsv joins fields with a raw comma and does not escape quotes or embedded commas. Any field that contains either will produce malformed CSV.',
      change: 'Escape each field per RFC 4180: wrap in quotes and double any internal quotes.', isCode: false, lineHint: 6 },
    { id: 4, file: 'tests/exportCustomers.test.ts', category: 'Missing test', severity: 'Medium',
      title: 'Add coverage for special-character escaping',
      explanation: 'No test exercises values that contain commas, quotes, or newlines — exactly the cases most likely to corrupt the output.',
      change: 'Add a test that uses a customer name containing a comma and a quote and asserts the row round-trips through a CSV parser.', isCode: false },
  ],
};

// =============== Sprint history for graphs ===============
window.SPRINT_LABELS = ['S20', 'S21', 'S22', 'S23', 'S24', 'S25'];

// Payments now: started WORST on readiness, MIDDLING on approval, ended best on both.
// Colors: only periwinkle + blue + black + grey — no yellow/red.
window.TEAM_HISTORY = {
  payments: { usage: [8,  14, 28, 45, 60, 74], approvalH: [24, 22, 19, 16, 13, 11], color: '#6B6BFF' },
  growth:   { usage: [38, 42, 48, 52, 58, 62], approvalH: [28, 24, 21, 18, 16, 14], color: '#5E9BD6' },
  // Platform: PR readiness slightly declining; approval time slightly worsening
  platform: { usage: [28, 27, 27, 26, 25, 24], approvalH: [28, 29, 29, 30, 30, 31], color: '#2A2438' },
  // Data: flat — no real improvement on either
  data:     { usage: [21, 22, 22, 21, 22, 22], approvalH: [29, 29, 30, 29, 30, 29], color: '#9A93A8' },
};

// =============== Payments team — individuals (for manager dashboard) ===============
window.PAYMENTS_TEAM_MEMBERS = [
  {
    id: 'maya',  name: 'Maya Chen', role: 'Senior Engineer', initials: 'MC',
    prsThisSprint: 4, currentReadiness: 82, avgApproval: 11, suggestionsActedOn: 12,
    readinessHistory: [40, 52, 60, 68, 75, 82],
    approvalHistory:  [22, 18, 16, 14, 12, 11],
    note: 'Most consistent adopter on the team.',
  },
  {
    id: 'aisha', name: 'Aisha Bello', role: 'Engineer', initials: 'AB',
    prsThisSprint: 3, currentReadiness: 72, avgApproval: 12, suggestionsActedOn: 8,
    readinessHistory: [30, 38, 50, 60, 65, 72],
    approvalHistory:  [26, 22, 18, 15, 13, 12],
    note: 'Steepest improvement this quarter.',
  },
  {
    id: 'jordan', name: 'Jordan Park', role: 'Staff Engineer', initials: 'JP',
    prsThisSprint: 3, currentReadiness: 0, avgApproval: 13, suggestionsActedOn: 0,
    readinessHistory: [0, 0, 0, 0, 0, 0],
    approvalHistory:  [14, 14, 13, 13, 13, 13],
    note: 'Hasn\'t adopted readiness yet — approval time mostly unchanged.',
  },
  {
    id: 'carlos', name: 'Carlos Reyes', role: 'Engineer', initials: 'CR',
    prsThisSprint: 2, currentReadiness: 38, avgApproval: 10, suggestionsActedOn: 3,
    readinessHistory: [22, 48, 18, 55, 30, 38],
    approvalHistory:  [13, 12, 12, 11, 11, 10],
    note: 'Inconsistent AI use — readiness scores swing sprint to sprint; approval time trending slightly down.',
  },
];

// =============== Users ===============
window.USERS = {
  maya:  { id: 'maya',  name: 'Maya Chen',  role: 'developer', team: 'Payments', initials: 'MC' },
  priya: { id: 'priya', name: 'Priya Shah', role: 'manager',   team: 'Payments', initials: 'PS' },
};

// =============== Suggestion patches: how the code transforms on Accept / Mark fixed ===============
// Each patch = { file, apply: (currentCode) => newCode }
window.SUGGESTION_PATCHES = {
  184: {
    1: {
      // Add regression test for duplicate delivery
      file: 'tests/billingWebhookHandler.test.ts',
      apply: (c) => c.replace(
        "  it('warns when payment missing', async () => {\n    const event = mockEvent({ paymentId: 'missing' })\n    await handleBillingWebhook(event)\n    expect(logger.warn).toHaveBeenCalled()\n  })\n})",
        "  it('warns when payment missing', async () => {\n    const event = mockEvent({ paymentId: 'missing' })\n    await handleBillingWebhook(event)\n    expect(logger.warn).toHaveBeenCalled()\n  })\n\n  it('does not enqueue twice for duplicate webhook delivery', async () => {\n    const event = mockEvent({ status: 'failed' })\n    await handleBillingWebhook(event)\n    await handleBillingWebhook(event)\n    expect(retryQueue.size()).toBe(1)\n  })\n})"
      ),
    },
    2: {
      // Enrich missing-payment warn log
      file: 'src/webhooks/billingWebhookHandler.ts',
      apply: (c) => c.replace(
        "    logger.warn(`Payment not found: ${event.paymentId}`)",
        "    logger.warn(`Payment not found: ${event.paymentId}`, {\n      eventId: event.id,\n      paymentId: event.paymentId,\n      providerStatus: event.providerStatus,\n    })"
      ),
    },
    3: {
      // PR description: explain retry count change
      file: 'PR description',
      apply: (c) => c.includes('Retry count increased from 3 to 5')
        ? c
        : c + "\n\nRetry count increased from 3 to 5 after billing ops reported transient provider failures during peak webhook volume.",
    },
    4: {
      // Wrap retry + status update in transaction
      file: 'src/webhooks/billingWebhookHandler.ts',
      apply: (c) => c.replace(
        "  if (event.status === 'failed') {\n    await retryQueue.add({\n      paymentId: payment.id,\n      retryCount: 5,\n      reason: event.failureReason\n    })\n  }\n\n  await updatePaymentStatus(payment.id, event.status)",
        "  await db.transaction(async (tx) => {\n    if (event.status === 'failed') {\n      await retryQueue.add({\n        paymentId: payment.id,\n        retryCount: 5,\n        reason: event.failureReason,\n      }, { tx })\n    }\n    await updatePaymentStatus(payment.id, event.status, { tx })\n  })"
      ),
    },
    5: {
      // PR description: append reviewer note
      file: 'PR description',
      apply: (c) => c.includes('billing reconciliation')
        ? c
        : c + "\n\nNote for reviewers: please verify retry behavior against billing reconciliation dashboard assumptions.",
    },
  },
};
