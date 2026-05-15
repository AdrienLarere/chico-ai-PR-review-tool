// Admin — internal product-analytics dashboard for the team building chico.ai
// Not linked from anywhere in the UI; reachable via /admin only.

const PageAdmin = ({ ctx }) => {
  const metrics = window.ADMIN_METRICS;
  const history = window.ADMIN_HISTORY;
  const byTeam = window.ADMIN_BY_TEAM;

  const [trendKey, setTrendKey] = React.useState('acceptance');
  const trendOptions = [
    { id: 'acceptance', label: 'Acceptance rate',  suffix: '%' },
    { id: 'repeat',     label: 'Repeat usage',     suffix: '%' },
    { id: 'nps',        label: 'NPS',              suffix: ''  },
    { id: 'thumbsUp',   label: 'Thumbs up',        suffix: '%' },
    { id: 'thumbsDown', label: 'Thumbs down',      suffix: '%' },
  ];
  const trendCurrent = trendOptions.find(t => t.id === trendKey);
  const trendData = history[trendKey];

  return (
    <div className="col gap-20" style={{ paddingTop: 8, paddingBottom: 40 }}>

      {/* Header */}
      <div className="pillow p-24">
        <div className="between wrap gap-20" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div className="t-12 text-3 uppercase mb-4">Internal · chico.ai team</div>
            <div className="t-28 text-1">Adoption analytics</div>
            <div className="t-14 text-2 mt-6" style={{ maxWidth: 720 }}>
              How PR Readiness is performing across all customers and teams. These are the numbers we use to decide what to ship next on the adoption side.
            </div>
          </div>
          <div className="row gap-10 wrap" style={{ justifyContent: 'flex-end' }}>
            <span className="pill pill-accent">Sprint 24.10</span>
            <span className="pill pill-good"><Icon name="check" className="ic ic-sm" /> Live</span>
          </div>
        </div>
      </div>

      {/* Hero metric tiles */}
      <div className="admin-grid">
        {metrics.map(m => <MetricTile key={m.id} m={m} />)}
      </div>

      {/* Trend chart */}
      <div className="pillow p-24">
        <div className="between wrap mb-16" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="t-20 text-1">{trendCurrent.label} over time</div>
            <div className="t-12 text-3 mt-4">Six sprints. Hover a point for the exact value.</div>
          </div>
          <div className="row gap-6 wrap">
            {trendOptions.map(t => (
              <button
                key={t.id}
                className={`pillow-chip ${trendKey === t.id ? 'active' : ''}`}
                onClick={() => setTrendKey(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <AdminTrend data={trendData} suffix={trendCurrent.suffix} />
      </div>

      {/* Per-team breakdown */}
      <div className="pillow p-24">
        <div className="t-20 text-1 mb-4">By team</div>
        <div className="t-12 text-3 mb-16">Same metrics, segmented by engineering team. A way to see where adoption is uneven.</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Team</th>
              <th>Acceptance</th>
              <th>Repeat usage</th>
              <th>NPS</th>
              <th>Thumbs up</th>
              <th>Thumbs down</th>
            </tr>
          </thead>
          <tbody>
            {byTeam.map(t => (
              <tr key={t.team}>
                <td className="w-600">{t.team}</td>
                <td><MiniBarCell value={t.acceptance} /></td>
                <td><MiniBarCell value={t.repeat} /></td>
                <td className="w-500" style={{ color: t.nps >= 30 ? 'var(--good-fg)' : t.nps >= 15 ? 'var(--warn-fg)' : 'var(--risk-fg)' }}>
                  {t.nps > 0 ? `+${t.nps}` : t.nps}
                </td>
                <td><MiniBarCell value={t.thumbsUp} tone="good" /></td>
                <td><MiniBarCell value={t.thumbsDown} tone="warn" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="glass p-20">
        <div className="row gap-10">
          <div className="row center" style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(107,107,255,0.22)', color: '#B5B5FF' }}>
            <Icon name="spark" className="ic ic-sm" />
          </div>
          <div className="flex-1">
            <div className="t-12 glass-text-3 uppercase mb-4">Internal note</div>
            <div className="t-14 glass-text-1" style={{ lineHeight: 1.55 }}>
              Numbers in this view are aggregated across all customers. For per-customer drilldown, use the segment selector (coming up next sprint).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== Hero metric tile ===============
function MetricTile({ m }) {
  const trendUp = m.trend >= 0;
  const trendGood =
    m.id === 'thumbsDown' ? !trendUp : trendUp;
  const trendColor = trendGood ? 'var(--good-fg)' : 'var(--risk-fg)';
  return (
    <div className="admin-tile pillow p-20">
      <div className="t-12 text-3 uppercase mb-8" style={{ minHeight: 32 }}>{m.label}</div>
      <div className="row gap-10" style={{ alignItems: 'baseline' }}>
        <div className="t-40 text-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {m.value}{m.suffix && <span className="t-20 text-3" style={{ marginLeft: 2 }}>{m.suffix}</span>}
        </div>
        <div className="t-12 w-500" style={{ color: trendColor }}>
          {m.trend >= 0 ? '↑' : '↓'} {Math.abs(m.trend)}{m.suffix} this sprint
        </div>
      </div>
      <div className="t-12 text-2 mt-12" style={{ lineHeight: 1.55, minHeight: 36 }}>{m.sub}</div>
    </div>
  );
}

// =============== Small bar cell for the breakdown table ===============
function MiniBarCell({ value, tone }) {
  const color = tone === 'warn' ? 'rgba(217,107,122,0.7)' : tone === 'good' ? 'rgba(79,184,155,0.75)' : 'var(--accent)';
  return (
    <div className="row gap-8" style={{ minWidth: 120 }}>
      <div className="mini-bar" style={{ flex: 1 }}>
        <div style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="t-12 w-500" style={{ minWidth: 32, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

// =============== Time-series trend chart ===============
function AdminTrend({ data, suffix }) {
  const W = 1080, H = 280, PAD = { l: 64, r: 32, t: 24, b: 44 };
  const labels = window.SPRINT_LABELS;
  const n = data.length;
  const yMin = 0;
  const yMaxRaw = Math.max(...data);
  const yMax = Math.ceil((yMaxRaw + 10) / 10) * 10;
  const xs = (i) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const ys = (v) => H - PAD.b - ((v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);
  const ticks = [];
  const step = (yMax - yMin) / 4;
  for (let i = 0; i <= 4; i++) ticks.push(yMin + step * i);

  // Build a smooth area path
  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
  const areaPath = `${linePath} L ${xs(n - 1)} ${ys(yMin)} L ${xs(0)} ${ys(yMin)} Z`;

  return (
    <div className="pillow-inset" style={{ padding: 12, borderRadius: 16 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="adminTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(107,107,255,0.32)" />
            <stop offset="100%" stopColor="rgba(107,107,255,0)" />
          </linearGradient>
        </defs>
        {ticks.map((y, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={ys(y)} y2={ys(y)} stroke="rgba(200,194,217,0.4)" strokeDasharray="2 4" />
            <text x={PAD.l - 8} y={ys(y) + 4} textAnchor="end" fontSize="11" fill="var(--text-3)">{Math.round(y)}{suffix}</text>
          </g>
        ))}
        {labels.map((lab, i) => (
          <text key={lab} x={xs(i)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fill="var(--text-3)">{lab}</text>
        ))}
        <path d={areaPath} fill="url(#adminTrendFill)" />
        <path d={linePath} stroke="var(--accent)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <g key={i} style={{ cursor: 'pointer' }}>
            <title>{`${labels[i]} — ${v}${suffix}`}</title>
            <circle cx={xs(i)} cy={ys(v)} r={9} fill="var(--accent)" opacity={0.18} />
            <circle cx={xs(i)} cy={ys(v)} r={4.5} fill="var(--accent)" />
            <circle cx={xs(i)} cy={ys(v)} r={14} fill="transparent" />
          </g>
        ))}
      </svg>
    </div>
  );
}

window.PageAdmin = PageAdmin;
