// Page 5: Team Performance / ROI — 3-graph carousel + comparison + ROI

const PageROI = ({ ctx }) => {
  const [graphIdx, setGraphIdx] = React.useState(0);

  const graphs = [
    {
      title: 'PR readiness × approval time',
      sub: 'One dot per team. Higher PR readiness usage is associated with faster median approval.',
      render: () => <ScatterGraph />,
    },
    {
      title: 'AI usage by team, over time',
      sub: "Share of each team's PRs that went through a PR readiness review, by sprint. Higher = more AI use.",
      render: () => <TimeGraph series="usage" yLabel="% of PRs" yMin={0} yMax={100} ySuffix="%" />,
    },
    {
      title: 'PR approval window over time',
      sub: 'Median time from PR opened to first approval, by sprint. Lower is better.',
      render: () => <TimeGraph series="approvalH" yLabel="Hours" yMin={0} yMax={36} ySuffix="h" />,
    },
  ];
  const g = graphs[graphIdx];
  const prev = () => setGraphIdx((graphIdx + graphs.length - 1) % graphs.length);
  const next = () => setGraphIdx((graphIdx + 1) % graphs.length);

  return (
    <div className="col gap-20">
      {/* 3-graph carousel */}
      <div className="pillow p-24">
        <div className="t-28 text-1 mb-16">Team Comparison</div>
        <div className="between wrap mb-12">
          <div>
            <div className="row gap-8">
              <div className="t-20 text-1">{g.title}</div>
              <span className="pill pill-accent">{graphIdx + 1} / {graphs.length}</span>
            </div>
            <div className="t-12 text-3 mt-4">{g.sub}</div>
          </div>
          <div className="row gap-6">
            <button className="btn btn-pillow btn-sm" onClick={prev} aria-label="Previous graph"><Icon name="chevR" className="ic ic-sm" style={{ transform: 'rotate(180deg)' }} /></button>
            <div className="row gap-6" style={{ alignItems: 'center', padding: '0 6px' }}>
              {graphs.map((_, i) => (
                <button key={i} onClick={() => setGraphIdx(i)} aria-label={`Graph ${i+1}`} style={{
                  width: 8, height: 8, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: i === graphIdx ? 'var(--accent)' : 'rgba(200,194,217,0.55)',
                  transition: 'background 200ms',
                }}></button>
              ))}
            </div>
            <button className="btn btn-pillow btn-sm" onClick={next} aria-label="Next graph"><Icon name="chevR" className="ic ic-sm" /></button>
          </div>
        </div>

        <div key={graphIdx} className="bounce-in">
          {g.render()}
        </div>

        <div className="row gap-12 wrap mt-12" style={{ justifyContent: 'center' }}>
          {window.TEAMS.map(t => {
            const color = window.TEAM_HISTORY[t.id].color;
            return (
              <div key={t.id} className="row gap-6" style={{ alignItems: 'center' }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: color, display: 'inline-block' }}></span>
                <span className="t-12 text-2">{t.name}</span>
                <span className="t-12 text-3">·</span>
                <span className="t-12 text-3">{t.manager}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison table */}
      <div className="pillow p-20">
        <div className="t-20 text-1 mb-12">Comparison Table</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Team</th>
              <th>PR readiness usage</th>
              <th>Suggestions acted on</th>
              <th>Median approval</th>
              <th>Review cycles</th>
              <th>Quality guardrail</th>
            </tr>
          </thead>
          <tbody>
            {window.TEAMS.map(t => (
              <tr key={t.id}>
                <td className="w-600">{t.name}</td>
                <td>
                  <div className="row gap-8" style={{ minWidth: 140 }}>
                    <div className="mini-bar" style={{ flex: 1 }}><div style={{ width: `${t.usage}%` }} /></div>
                    <span className="t-12 w-500">{t.usage}%</span>
                  </div>
                </td>
                <td>{t.acted}%</td>
                <td>{t.approvalH}h</td>
                <td>{t.cycles}</td>
                <td><span className={`pill ${t.guardrail === 'Stable' ? 'pill-good' : 'pill-warn'}`}>{t.guardrail}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function BrkLite({ k, v }) {
  return (
    <div className="between">
      <span className="t-12 glass-text-2">{k}</span>
      <span className="t-14 w-500 glass-text-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</span>
    </div>
  );
}

// =============== Graph 1: scatter ===============
function ScatterGraph() {
  const W = 1080, H = 320, PAD = { l: 64, r: 32, t: 36, b: 44 };
  const yMax = 36;
  const xs = (v) => PAD.l + (v / 100) * (W - PAD.l - PAD.r);
  const ys = (v) => H - PAD.b - (v / yMax) * (H - PAD.t - PAD.b);
  const trend = [{ x: 8, y: 32 }, { x: 92, y: 8 }];

  return (
    <div className="pillow-inset" style={{ padding: 12, borderRadius: 16 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {[0, 12, 24, 36].map(y => (
          <g key={y}>
            <line x1={PAD.l} x2={W - PAD.r} y1={ys(y)} y2={ys(y)} stroke="rgba(200,194,217,0.4)" strokeDasharray="2 4" />
            <text x={PAD.l - 8} y={ys(y) + 4} textAnchor="end" fontSize="11" fill="var(--text-3)">{y}h</text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map(x => (
          <text key={x} x={xs(x)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fill="var(--text-3)">{x}%</text>
        ))}
        <text x={(PAD.l + W - PAD.r) / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--text-3)">PR readiness usage</text>
        <text transform={`translate(16, ${(PAD.t + H - PAD.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill="var(--text-3)">Median approval time</text>
        <line x1={xs(trend[0].x)} y1={ys(trend[0].y)} x2={xs(trend[1].x)} y2={ys(trend[1].y)} stroke="#B5B5FF" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
        {window.TEAMS.map(t => {
          const color = window.TEAM_HISTORY[t.id].color;
          return (
            <g key={t.id} style={{ cursor: 'pointer' }}>
              <title>{`${t.name} — ${t.usage}% PR readiness usage, ${t.approvalH}h median approval`}</title>
              <circle cx={xs(t.usage)} cy={ys(t.approvalH)} r={14} fill={color} opacity="0.18" />
              <circle cx={xs(t.usage)} cy={ys(t.approvalH)} r={8} fill={color} />
              <text x={xs(t.usage)} y={ys(t.approvalH) - 16} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-1)">{t.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// =============== Graph 2/3: time-series multi-line ===============
function TimeGraph({ series, yLabel, yMin, yMax, ySuffix }) {
  const W = 1080, H = 320, PAD = { l: 64, r: 80, t: 18, b: 44 };
  const labels = window.SPRINT_LABELS;
  const n = labels.length;
  const xs = (i) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const ys = (v) => H - PAD.b - ((v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  const ticks = [];
  const step = (yMax - yMin) / 4;
  for (let i = 0; i <= 4; i++) ticks.push(yMin + step * i);

  return (
    <div className="pillow-inset" style={{ padding: 12, borderRadius: 16 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {ticks.map((y, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={ys(y)} y2={ys(y)} stroke="rgba(200,194,217,0.4)" strokeDasharray="2 4" />
            <text x={PAD.l - 8} y={ys(y) + 4} textAnchor="end" fontSize="11" fill="var(--text-3)">{Math.round(y)}{ySuffix}</text>
          </g>
        ))}
        {labels.map((lab, i) => (
          <text key={lab} x={xs(i)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fill="var(--text-3)">{lab}</text>
        ))}
        <text x={(PAD.l + W - PAD.r) / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--text-3)">Sprint</text>
        <text transform={`translate(16, ${(PAD.t + H - PAD.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill="var(--text-3)">{yLabel}</text>

        {window.TEAMS.map(t => {
          const data = window.TEAM_HISTORY[t.id][series];
          const color = window.TEAM_HISTORY[t.id].color;
          const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
          return (
            <g key={t.id}>
              <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {data.map((v, i) => (
                <g key={i} style={{ cursor: 'pointer' }}>
                  <title>{`${t.name} · ${labels[i]} — ${v}${ySuffix}`}</title>
                  <circle cx={xs(i)} cy={ys(v)} r={8} fill={color} opacity={0.15} />
                  <circle cx={xs(i)} cy={ys(v)} r={4.5} fill={color} />
                  <circle cx={xs(i)} cy={ys(v)} r={14} fill="transparent" />
                </g>
              ))}
              <text x={xs(data.length - 1) + 8} y={ys(data[data.length - 1]) + 4} fontSize="11" fontWeight="600" fill={color}>{t.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

window.PageROI = PageROI;
