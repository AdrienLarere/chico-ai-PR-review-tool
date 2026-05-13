// Page 1: Manager Dashboard — Priya's view of her team's individuals

const PageDashboard = ({ ctx }) => {
  const members = window.PAYMENTS_TEAM_MEMBERS;
  const teamAvgReadiness = Math.round(members.reduce((s, m) => s + m.currentReadiness, 0) / members.length);
  const teamAvgApproval = (members.reduce((s, m) => s + m.avgApproval, 0) / members.length).toFixed(1);
  const totalPRs = members.reduce((s, m) => s + m.prsThisSprint, 0);
  const totalActedOn = members.reduce((s, m) => s + m.suggestionsActedOn, 0);

  return (
    <div className="col gap-20">
      {/* Header — no filters, no big button */}
      <div className="pillow p-24">
        <div className="t-12 text-3 uppercase mb-4">Payments team · Sprint 24.10</div>
        <div className="t-28 text-1">How your team is using PR readiness</div>
        <div className="t-14 text-2 mt-6" style={{ maxWidth: 720 }}>
          Each engineer's readiness scores and PR approval times over the last six sprints. Some engineers haven't adopted readiness yet — their approval times are essentially flat noise. Use these views to spot who would benefit from a nudge.
        </div>

        <div className="row gap-10 mt-16 wrap">
          <SummaryStat label="Team avg readiness" value={teamAvgReadiness} suffix="/100" tone={teamAvgReadiness >= 80 ? 'good' : 'warn'} />
          <SummaryStat label="Team avg approval" value={teamAvgApproval} suffix="h" tone="good" />
          <SummaryStat label="PRs this sprint" value={totalPRs} />
          <SummaryStat label="Suggestions acted on" value={totalActedOn} />
        </div>
      </div>

      {/* Per-individual cards */}
      <div className="col gap-14">
        {members.map(m => <MemberCard key={m.id} m={m} />)}
      </div>

      {/* Chico observation */}
      <div className="glass p-24">
        <div className="row gap-10 mb-12">
          <div className="row center" style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(107,107,255,0.22)', color: '#B5B5FF' }}>
            <Icon name="spark" className="ic ic-sm" />
          </div>
          <div>
            <div className="t-16 w-600 glass-text-1">What Chico noticed about your team</div>
            <div className="t-12 glass-text-3">Patterns this sprint</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { stat: 'Aisha', body: 'Aisha\'s readiness scores climbed 42 points in 5 sprints — the steepest improvement on the team.' },
            { stat: 'Jordan', body: 'Jordan hasn\'t opened a readiness review yet. His approval time has barely moved — likely room for a nudge.' },
            { stat: 'Maya',  body: 'Maya is consistently above 80 readiness and is ready to model the habit on team standup.' },
          ].map((ins, i) => (
            <div key={i} className="glass-sub p-18" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(180,170,230,0.32), transparent)' }} />
              <div className="t-28 glass-text-1">{ins.stat}</div>
              <div className="t-12 glass-text-2 mt-8" style={{ minHeight: 56, lineHeight: 1.5 }}>{ins.body}</div>
              <div className="row gap-6 mt-12 wrap">
                <button className="btn btn-ghost-dark btn-xs">Open profile</button>
                <button className="btn btn-ghost-dark btn-xs">Share with engineer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function SummaryStat({ label, value, suffix, tone }) {
  const colors = { good: 'var(--good-fg)', warn: 'var(--warn-fg)', risk: 'var(--risk-fg)' };
  return (
    <div className="pillow-inset" style={{ padding: '10px 16px', borderRadius: 12, minWidth: 130 }}>
      <div className="t-12 text-3">{label}</div>
      <div className="t-20 w-600 mt-4" style={{ color: tone ? colors[tone] : 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>
        {value}{suffix && <span className="t-14 text-3" style={{ marginLeft: 2 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function MemberCard({ m }) {
  const readinessDelta = m.readinessHistory[m.readinessHistory.length - 1] - m.readinessHistory[0];
  const approvalDelta = m.approvalHistory[m.approvalHistory.length - 1] - m.approvalHistory[0]; // negative = improvement

  return (
    <div className="pillow p-20">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: 24, alignItems: 'center' }}>
        {/* identity + snapshot */}
        <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
          <div className="row center" style={{ width: 48, height: 48, borderRadius: '50%', background: '#2A2438', color: 'white', fontSize: 16, fontWeight: 600, flex: '0 0 auto' }}>
            {m.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="t-16 w-600 text-1" style={{ lineHeight: 1.25 }}>{m.name}</div>
            <div className="t-12 text-3">{m.role}</div>
            <div className="row gap-10 mt-10 wrap">
              <span className="pill-inline">
                <span className="t-12 text-3">Readiness</span>
                <span className="t-14 w-600 text-1">{m.currentReadiness}</span>
              </span>
              <span className="pill-inline">
                <span className="t-12 text-3">Approval</span>
                <span className="t-14 w-600 text-1">{m.avgApproval}h</span>
              </span>
            </div>
            <div className="t-12 text-3 italic mt-10" style={{ lineHeight: 1.4 }}>{m.note}</div>
          </div>
        </div>

        {/* readiness sparkline */}
        <MiniLineGraph
          title="Readiness over time"
          data={m.readinessHistory}
          delta={readinessDelta}
          deltaGoodWhenPositive
          yMin={0}
          yMax={100}
          ySuffix=""
          color="#6B6BFF"
        />

        {/* approval sparkline */}
        <MiniLineGraph
          title="Approval time over time"
          data={m.approvalHistory}
          delta={approvalDelta}
          deltaGoodWhenPositive={false}
          yMin={0}
          yMax={Math.max(32, ...m.approvalHistory) + 2}
          ySuffix="h"
          color="#2A2438"
        />
      </div>
    </div>
  );
}

function MiniLineGraph({ title, data, delta, deltaGoodWhenPositive, yMin, yMax, ySuffix, color }) {
  const W = 340, H = 110, PAD = { l: 28, r: 12, t: 14, b: 22 };
  const n = data.length;
  const xs = (i) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const ys = (v) => H - PAD.b - ((v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
  const area = `${path} L ${xs(n - 1)} ${H - PAD.b} L ${xs(0)} ${H - PAD.b} Z`;
  const labels = window.SPRINT_LABELS;
  const current = data[data.length - 1];

  // semantic for delta pill
  const improved = deltaGoodWhenPositive ? delta > 0 : delta < 0;
  const tone = delta === 0 ? 'neutral' : (improved ? 'good' : 'risk');
  const arrow = delta === 0 ? '' : (delta > 0 ? '↑' : '↓');
  const deltaText = `${arrow} ${Math.abs(delta)}${ySuffix}`;

  const gradId = `mg-${color.replace('#', '')}-${data.join('')}`;

  return (
    <div>
      <div className="between mb-6">
        <div className="t-12 text-3">{title}</div>
        <span className={`pill ${tone === 'good' ? 'pill-good' : tone === 'risk' ? 'pill-risk' : 'pill-neutral'}`} style={{ fontSize: 11 }}>{deltaText}</span>
      </div>
      <div className="pillow-inset" style={{ borderRadius: 12, padding: 6 }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* y gridlines (2) */}
          {[yMin, (yMin + yMax) / 2, yMax].map((y, i) => (
            <g key={i}>
              <line x1={PAD.l} x2={W - PAD.r} y1={ys(y)} y2={ys(y)} stroke="rgba(200,194,217,0.4)" strokeDasharray="2 4" />
              <text x={PAD.l - 4} y={ys(y) + 3} textAnchor="end" fontSize="9" fill="var(--text-3)">{Math.round(y)}</text>
            </g>
          ))}
          {/* x labels */}
          {labels.map((lab, i) => (
            <text key={lab} x={xs(i)} y={H - PAD.b + 14} textAnchor="middle" fontSize="9" fill="var(--text-3)">{lab}</text>
          ))}
          {/* area + line */}
          <path d={area} fill={`url(#${gradId})`} />
          <path d={path} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* dots */}
          {data.map((v, i) => (
            <circle key={i} cx={xs(i)} cy={ys(v)} r={i === data.length - 1 ? 4 : 2.5} fill={color} />
          ))}
        </svg>
      </div>
    </div>
  );
}

window.PageDashboard = PageDashboard;
