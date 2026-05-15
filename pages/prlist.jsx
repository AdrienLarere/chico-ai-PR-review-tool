// Developer's PR list — only their own PRs, click → detail

const PagePrList = ({ ctx }) => {
  const user = ctx.user;
  const myPRs = window.PRS.filter(p => p.author === user.name);

  // Live-update PR184 from interactive state
  const list = myPRs.map(p => p.id === 184 ? {
    ...p,
    score: ctx.pr184.score,
    readiness: window.readinessFromScore(ctx.pr184.score),
    accepted: Object.values(ctx.pr184.actions).filter(v => v === 'accepted').length,
    declined: Object.values(ctx.pr184.actions).filter(v => v === 'declined').length,
    ignored: 5 - Object.keys(ctx.pr184.actions).length,
  } : p);

  const stats = {
    open: list.length,
    needAttn: list.filter(p => p.readiness !== 'good').length,
    avg: Math.round(list.reduce((s, p) => s + p.score, 0) / list.length),
  };

  return (
    <div className="col gap-20">
      <div className="pillow p-24">
        <div className="between wrap gap-20" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div className="row gap-10 wrap" style={{ alignItems: 'center' }}>
              <div className="t-28 text-1">My pull requests</div>
              <button className="btn btn-pillow btn-sm"><Icon name="external" className="ic ic-sm" /> Open in GitHub</button>
            </div>
            <div className="t-14 text-2 mt-6" style={{ maxWidth: 640 }}>
              Run a readiness check before you request human review. Higher readiness scores get approvals faster.
            </div>
          </div>
          <div className="row gap-10 wrap" style={{ justifyContent: 'flex-end' }}>
            <QuickStat label="Open PRs"      value={stats.open} />
            <QuickStat label="Need attention" value={stats.needAttn} tone={stats.needAttn ? 'warn' : 'good'} />
            <QuickStat label="Avg readiness" value={`${stats.avg}/100`} tone={stats.avg >= 85 ? 'good' : stats.avg >= 70 ? 'warn' : 'risk'} />
          </div>
        </div>
      </div>

      {/* PR cards */}
      <div className="col gap-12">
        {list.map(pr => <PrRowCard key={pr.id} pr={pr} onOpen={() => ctx.openPR(pr.id)} />)}
      </div>

      {/* Chico tip */}
      <div className="glass p-20">
        <div className="row gap-10 mb-8">
          <div className="row center" style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(107,107,255,0.22)', color: '#B5B5FF' }}>
            <Icon name="spark" className="ic ic-sm" />
          </div>
          <div className="t-12 glass-text-3 uppercase">Tip from Chico</div>
        </div>
        <div className="t-14 glass-text-1" style={{ maxWidth: 720, lineHeight: 1.55 }}>
          PRs at 90+ readiness usually go through review in one cycle. PR #184 is close — three more accepted suggestions and it crosses the line.
        </div>
      </div>
    </div>
  );
};

function PrRowCard({ pr, onOpen }) {
  const readinessClass = window.readinessPillClass(pr.readiness);
  return (
    <div className="pillow p-20" style={{ cursor: 'pointer', transition: 'box-shadow 220ms ease-out' }}
      onClick={onOpen}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '-8px -8px 20px rgba(255,255,255,0.9), 8px 8px 20px rgba(200,194,217,0.55)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
    >
      <div className="row gap-20" style={{ alignItems: 'center' }}>
        {/* score ring */}
        <div className="row center" style={{ flex: '0 0 auto' }}>
          <div className="score-ring" style={{ '--p': pr.score, '--size': '64px', fontSize: 16 }}>
            <span>{pr.score}</span>
          </div>
        </div>

        {/* main info */}
        <div className="flex-1">
          <div className="row gap-10 wrap mb-4">
            <span className={`pill ${readinessClass}`}>{window.readinessLabel(pr.readiness)}</span>
            <span className="t-12 text-3 mono">#{pr.id} · {pr.repo}</span>
            <span className="t-12 text-3">opened {pr.opened}</span>
            <span className={`pill ${pr.reviewStatus === 'Approved' ? 'pill-good' : pr.reviewStatus === 'Changes requested' ? 'pill-risk' : 'pill-neutral'}`}>{pr.reviewStatus}</span>
          </div>
          <div className="t-20 text-1" style={{ lineHeight: 1.25 }}>{pr.title}</div>
          <div className="t-12 text-3 mt-6">{pr.linkedIssue}</div>
        </div>

        {/* suggestion summary */}
        <div className="row gap-16" style={{ flex: '0 0 auto', minWidth: 220 }}>
          <div>
            <div className="t-12 text-3">AI suggestions</div>
            <div className="t-20 text-1 w-600 mt-4" style={{ fontVariantNumeric: 'tabular-nums' }}>{pr.suggestions}</div>
          </div>
          <div>
            <div className="t-12 text-3">Acted on</div>
            <div className="t-20 text-1 w-600 mt-4" style={{ fontVariantNumeric: 'tabular-nums' }}>{pr.accepted}</div>
          </div>
        </div>

        <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          Review
          <Icon name="chevR" className="ic ic-sm" />
        </button>
      </div>
    </div>
  );
}

function QuickStat({ label, value, tone }) {
  const colors = { good: 'var(--good-fg)', warn: 'var(--warn-fg)', risk: 'var(--risk-fg)' };
  return (
    <div className="pillow-inset" style={{ padding: '10px 16px', borderRadius: 12, minWidth: 130 }}>
      <div className="t-12 text-3">{label}</div>
      <div className="t-20 w-600 mt-4" style={{ color: tone ? colors[tone] : 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

window.PagePrList = PagePrList;
