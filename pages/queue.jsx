// Page 2: PR Queue

const PageQueue = ({ ctx }) => {
  const [search, setSearch] = React.useState('');
  const [teamFilter, setTeamFilter] = React.useState('all');
  const [readyFilter, setReadyFilter] = React.useState('all');
  const [needsOnly, setNeedsOnly] = React.useState(false);

  // Build list, applying the live score for #184
  const prs = window.PRS.map(p => p.id === 184 ? { ...p, score: ctx.pr184.score, readiness: window.readinessFromScore(ctx.pr184.score),
    accepted: Object.values(ctx.pr184.actions).filter(v => v === 'accepted' || v === 'fixed').length,
    declined: Object.values(ctx.pr184.actions).filter(v => v === 'declined').length,
    ignored: 5 - Object.keys(ctx.pr184.actions).length,
  } : p);

  const filtered = prs.filter(p => {
    if (search && !(`${p.title} ${p.repo} ${p.author}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (teamFilter !== 'all' && p.teamId !== teamFilter) return false;
    if (readyFilter !== 'all' && p.readiness !== readyFilter) return false;
    if (needsOnly && p.readiness === 'good') return false;
    return true;
  });

  return (
    <div className="col gap-20">
      {/* Header */}
      <div className="pillow p-24">
        <div className="between wrap">
          <div>
            <div className="t-28 text-1">Pull Request Queue</div>
            <div className="t-14 text-2 mt-6" style={{ maxWidth: 640 }}>
              Prioritize reviews using PR readiness status and team-level risk signals.
            </div>
          </div>
          <div className="row gap-10 wrap">
            <button className="btn btn-pillow btn-sm" onClick={() => ctx.navigate('dashboard')}>
              <Icon name="dashboard" className="ic ic-sm" /> Dashboard
            </button>
            <button className={`btn ${needsOnly ? 'btn-primary' : 'btn-pillow'} btn-sm`} onClick={() => setNeedsOnly(v => !v)}>
              <Icon name="filter" className="ic ic-sm" /> Show only PRs needing attention
            </button>
          </div>
        </div>

        <div className="row gap-10 mt-20 wrap">
          <div className="pillow-inset" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', minWidth: 280, flex: 1 }}>
            <Icon name="search" className="ic ic-sm" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search PRs, repos, or authors"
              style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontFamily: 'inherit', fontSize: 14, color: 'var(--text-1)' }}
            />
          </div>
          <select className="pillow-select" value={teamFilter} onChange={e => setTeamFilter(e.target.value)}>
            <option value="all">All teams</option>
            {window.TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className="pillow-select" value={readyFilter} onChange={e => setReadyFilter(e.target.value)}>
            <option value="all">All readiness</option>
            <option value="good">Ready</option>
            <option value="warn">Needs attention</option>
            <option value="risk">Risky</option>
            <option value="blocked">Blocked</option>
          </select>
          <select className="pillow-select">
            <option>All developers</option>
            <option>Maya Chen</option>
            <option>Theo Martin</option>
            <option>Sam Rivera</option>
            <option>Lina Patel</option>
          </select>
          <select className="pillow-select">
            <option>Any suggestion status</option>
            <option>Has declined suggestions</option>
            <option>Has accepted suggestions</option>
            <option>Has pending suggestions</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'flex-start' }}>
        {/* PR Table */}
        <div className="pillow p-20">
          <div className="between mb-12">
            <div className="t-20 text-1">{filtered.length} pull requests</div>
            <div className="t-12 text-3">
              Click a PR to open the readiness review
            </div>
          </div>
          <table className="tbl clickable">
            <thead>
              <tr>
                <th>PR</th>
                <th>Repository</th>
                <th>Author</th>
                <th>Readiness</th>
                <th style={{ width: 70 }}>Score</th>
                <th>AI suggestions</th>
                <th>Human review</th>
                <th style={{ width: 80 }}>Opened</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => ctx.openPR(p.id)}>
                  <td>
                    <div className="t-14 w-600 text-1">#{p.id} · {p.title}</div>
                    <div className="t-12 text-3 mt-4">{p.team}</div>
                  </td>
                  <td className="mono t-12 text-2">{p.repo}</td>
                  <td className="text-2">{p.author}</td>
                  <td>
                    <span className={`pill ${window.readinessPillClass(p.readiness)}`}>{window.readinessLabel(p.readiness)}</span>
                  </td>
                  <td>
                    <div className="score-ring" style={{ '--p': p.score, '--size': '44px' }}>
                      <span>{p.score}</span>
                    </div>
                  </td>
                  <td>
                    <div className="t-12 text-1 w-500">{p.suggestions} total</div>
                    <div className="t-12 text-3 mt-4">
                      <span style={{ color: 'var(--good-fg)' }}>{p.accepted} accepted</span>
                      {p.declined > 0 && <>{' · '}<span style={{ color: 'var(--risk-fg)' }}>{p.declined} declined</span></>}
                      {p.ignored > 0  && <>{' · '}<span className="text-3">{p.ignored} ignored</span></>}
                    </div>
                  </td>
                  <td>
                    <span className={`pill ${p.reviewStatus === 'Approved' ? 'pill-good' : p.reviewStatus === 'Changes requested' ? 'pill-risk' : 'pill-neutral'}`}>
                      {p.reviewStatus}
                    </span>
                  </td>
                  <td className="t-12 text-3">{p.opened}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar: summary + legend */}
        <div className="col gap-16">
          <div className="pillow p-18">
            <div className="t-12 text-3 uppercase mb-12">Queue summary</div>
            <div className="col gap-10">
              {[
                ['Open PRs', '14'],
                ['Need attention', '6'],
                ['Risky', '2'],
                ['Waiting for review', '8'],
              ].map(([k, v]) => (
                <div key={k} className="between">
                  <span className="t-12 text-2">{k}</span>
                  <span className="t-16 w-600 text-1">{v}</span>
                </div>
              ))}
            </div>
            <div className="divider-light mt-16 mb-16"></div>
            <div className="t-12 text-3 uppercase mb-12">This sprint</div>
            <div className="col gap-10">
              <div className="between"><span className="t-12 text-2">AI suggestions</span><span className="t-16 w-600 text-1">41</span></div>
              <div className="between"><span className="t-12 text-2">Acted on / fixed</span><span className="t-16 w-600 text-1">25</span></div>
            </div>
          </div>

          <div className="pillow p-18">
            <div className="t-12 text-3 uppercase mb-12">Readiness legend</div>
            <div className="col gap-10">
              <LegendRow color="pill-good"    label="Ready"            body="No major blockers before human review." />
              <LegendRow color="pill-warn"    label="Needs attention"  body="AI found fixable issues that may slow review." />
              <LegendRow color="pill-risk"    label="Risky"            body="Higher-risk issues affecting logic, security, data, or tests." />
              <LegendRow color="pill-neutral" label="Blocked"          body="Missing required info or failing critical checks." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function LegendRow({ color, label, body }) {
  return (
    <div>
      <span className={`pill ${color}`}>{label}</span>
      <div className="t-12 text-3 mt-4" style={{ lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

window.PageQueue = PageQueue;
