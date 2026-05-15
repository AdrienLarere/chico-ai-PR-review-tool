// PR Review Detail — top card + 50/50 split + file switcher + role-aware
// Routes: opened from PR list (developer) or PR Queue (manager). Not in tab nav.

const { useState: rUS, useEffect: rUE, useRef: rUR } = React;

// Simple syntax highlighter — runs over a plain string per line
function highlight(line) {
  // order matters: comments, strings, keywords, numbers
  const out = [];
  let s = line;

  // strings (single/double/backtick) — greedy non-newline
  const tokens = [];
  const push = (t, v) => tokens.push({ t, v });

  // Tokenize with a regex pass
  const re = /(\`[^`]*\`)|('[^']*')|("[^"]*")|(\/\/[^\n]*)|\b(export|async|await|function|const|let|var|if|else|return|new|import|from|describe|it|expect|class|extends|interface|type)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*\s*\()|([{}();,.])/g;

  let last = 0;
  let m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) push('plain', s.slice(last, m.index));
    if (m[1] || m[2] || m[3]) push('str', m[0]);
    else if (m[4]) push('com', m[0]);
    else if (m[5]) push('key', m[0]);
    else if (m[6]) push('num', m[0]);
    else if (m[7]) {
      // name + opening paren — split
      const name = m[0].replace(/\s*\($/, '');
      push('fn', name);
      push('plain', m[0].slice(name.length));
    }
    else if (m[8]) push('punct', m[0]);
    last = re.lastIndex;
  }
  if (last < s.length) push('plain', s.slice(last));

  return tokens.map((t, i) => {
    if (t.t === 'plain' || t.t === 'punct') return <span key={i}>{t.v}</span>;
    return <span key={i} className={`tok-${t.t === 'com' ? 'com' : t.t}`}>{t.v}</span>;
  });
}

function CodeView({ code, file, suggestions, onSuggestionHover, focusedSugId, editable, onChange }) {
  const lines = code.split('\n');
  const lineMap = {};
  suggestions.forEach(s => { if (s.lineHint) lineMap[s.lineHint] = s.id; });

  // Editable mode: textarea with a parallel line-number gutter.
  if (editable) {
    return (
      <div className="dev-code-edit">
        <div className="code-gutter">
          {lines.map((l, i) => {
            const lineNum = i + 1;
            const sugId = lineMap[lineNum];
            return (
              <div key={i} className={`code-line-num ${sugId ? 'has-marker' : ''}`}>
                {sugId && (
                  <span className="line-marker" title={`Suggestion ${sugId}`} onClick={() => onSuggestionHover && onSuggestionHover(sugId)}>
                    {sugId}
                  </span>
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>
        <textarea
          className="code-editor"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          rows={Math.max(lines.length, 1)}
        />
      </div>
    );
  }

  // Read-only mode: keep the original highlighted view.
  return (
    <div className="dev-code-v2">
      {lines.map((l, i) => {
        const lineNum = i + 1;
        const sugId = lineMap[lineNum];
        const isFocused = focusedSugId && sugId === focusedSugId;
        return (
          <div key={i} className={`code-line ${sugId ? 'has-marker' : ''} ${isFocused ? 'focused' : ''}`}>
            <span className="line-no">{lineNum}</span>
            <span className="line-content">
              {sugId && (
                <span className="line-marker" title={`Suggestion ${sugId}`} onClick={() => onSuggestionHover && onSuggestionHover(sugId)}>
                  {sugId}
                </span>
              )}
              {highlight(l) || '\u00A0'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SuggestionBlock({ s, action, feedback, readOnly, onAct, onThumbsUp, onThumbsDown, onUndo, focused, onHoverLine, cardRef, dim }) {
  const sevClass = s.severity === 'High' ? 'pill-risk' : s.severity === 'Medium' ? 'pill-warn' : 'pill-neutral';
  // Only accept / decline give the whole card a glow — thumbs feedback lives on the button itself.
  const stateClass = action === 'accepted' ? 'accepted' : action === 'declined' ? 'declined' : '';

  const [sweep, setSweep] = rUS(false);
  rUE(() => {
    if (action === 'accepted') {
      setSweep(true);
      const id = setTimeout(() => setSweep(false), 900);
      return () => clearTimeout(id);
    }
  }, [action]);

  return (
    <div
      ref={cardRef}
      className={`glass glass-sub p-16 suggestion-card ${stateClass}`}
      style={{
        position: 'relative', overflow: 'hidden',
        outline: focused ? '1px solid rgba(180,170,230,0.5)' : 'none',
        opacity: dim ? 0.85 : 1,
      }}
      onMouseEnter={() => s.lineHint && onHoverLine && onHoverLine(s.id)}
      onMouseLeave={() => onHoverLine && onHoverLine(null)}
    >
      {sweep && <div className="lumi-edge" />}

      <div className="between gap-8 wrap mb-6">
        <div className="row gap-6 wrap">
          {s.lineHint && (
            <span className="line-chip">L{s.lineHint}</span>
          )}
          <span className="pill-dark">{s.category}</span>
          <span className={`pill-dark ${sevClass}`}>{s.severity}</span>
          {action === 'accepted' && (
            <span className="pill-dark pill-good">Accepted</span>
          )}
          {action === 'declined' && (
            <span className="pill-dark pill-risk">Declined</span>
          )}
        </div>
      </div>

      <div className="t-14 w-500 glass-text-1 sg-title" style={{ lineHeight: 1.4 }}>{s.title}</div>
      <div className="t-12 glass-text-2 mt-6" style={{ lineHeight: 1.55 }}>{s.explanation}</div>

      {s.isCode ? (
        <div className="glass-inset-code mt-10">{s.change}</div>
      ) : (
        <div className="mt-10" style={{
          padding: '9px 12px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(180,170,230,0.12)',
          borderRadius: 10,
          color: 'var(--dtext-1)',
          fontSize: 12.5,
          lineHeight: 1.55,
        }}>
          <span className="glass-text-3 t-12" style={{ display: 'block', marginBottom: 4 }}>Suggested change</span>
          {s.change}
        </div>
      )}

      {/* Action row.
          - Accept / Decline are primary actions that lock the suggestion (card glow + Undo).
          - Thumbs up / down are feedback; clicking does not collapse the row or show Undo. */}
      {!readOnly && !action && (
        <div className="row gap-6 mt-20" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost-dark btn-xs" onClick={() => onAct(s, 'accepted')}>
            <Icon name="check" className="ic ic-sm" /> Accept
          </button>
          <button className="btn btn-ghost-dark btn-xs" onClick={() => onAct(s, 'declined')}>
            <Icon name="x" className="ic ic-sm" /> Decline
          </button>
          <button
            className={`btn btn-ghost-dark btn-xs ${feedback === 'thumbs_up' ? 'thumb-up-active' : ''}`}
            onClick={() => onThumbsUp(s)}
            title="This suggestion was good"
          >
            <Icon name="thumbsUp" className="ic ic-sm" />
          </button>
          <button
            className={`btn btn-ghost-dark btn-xs ${feedback === 'thumbs_down' ? 'thumb-down-active' : ''}`}
            onClick={() => onThumbsDown(s)}
            title="This suggestion was not good"
          >
            <Icon name="thumbsDown" className="ic ic-sm" />
          </button>
        </div>
      )}
      {!readOnly && action && (
        <div className="row gap-6 mt-20" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost-dark btn-xs" onClick={() => onUndo && onUndo(s)}>
            <Icon name="refresh" className="ic ic-sm" /> Undo
          </button>
        </div>
      )}
    </div>
  );
}

function ThumbsDownModal({ s, onCancel, onConfirm }) {
  const [reason, setReason] = rUS(null);
  const [details, setDetails] = rUS('');
  const reasons = ['Incorrect', 'Not applicable to my code', 'Already handled elsewhere', 'Hallucinated reference', 'Too vague', 'Wrong file or line'];
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="glass p-24 bounce-in" style={{ maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="t-12 glass-text-3 uppercase mb-8">What was wrong with this suggestion?</div>
        <div className="t-20 glass-text-1">{s.title}</div>
        <div className="t-12 glass-text-3 mt-4">Optional. Helps us improve the model.</div>

        <div className="col gap-6 mt-16">
          {reasons.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(reason === r ? null : r)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 10,
                background: reason === r ? 'rgba(217,107,122,0.18)' : 'rgba(255,255,255,0.04)',
                border: '1px solid',
                borderColor: reason === r ? 'rgba(217,107,122,0.45)' : 'rgba(180,170,230,0.12)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13.5,
                color: 'var(--dtext-1)',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-16">
          <div className="t-12 glass-text-3 uppercase mb-6">More details (optional)</div>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Anything specific we should know…"
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(180,170,230,0.18)',
              borderRadius: 10,
              padding: '10px 12px',
              color: 'var(--dtext-1)',
              fontFamily: 'inherit',
              fontSize: 13,
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        <div className="row gap-10 mt-20" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost-dark" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onConfirm({ reason, details })}>Send feedback</button>
        </div>
      </div>
    </div>
  );
}

function NPSModal({ pr, onCancel, onSubmit }) {
  const QUESTIONS = [
    { id: 'overall', label: 'Overall, how was your experience with PR Readiness?' },
    { id: 'quality', label: 'How useful were the AI suggestions?' },
    { id: 'repeat',  label: 'Would you use it again on your next PR?' },
  ];
  const SCALE = ['Great', 'Decent', 'Neutral', 'Mediocre', 'Horrible'];
  const [text, setText] = rUS('');
  const [answers, setAnswers] = rUS({});

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="glass p-24 bounce-in" style={{ maxWidth: 680, width: '100%', maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="t-12 glass-text-3 uppercase mb-8">Quick feedback</div>
        <div className="t-20 glass-text-1">How was your experience?</div>
        <div className="t-12 glass-text-3 mt-4">Three short questions. Skip any of them — submitting always works.</div>

        <div className="col gap-18 mt-20">
          {QUESTIONS.map(q => (
            <div key={q.id}>
              <div className="glass-text-1 mb-8" style={{ lineHeight: 1.45, fontSize: 13.5 }}>{q.label}</div>
              <div className="nps-scale nps-scale-5">
                {SCALE.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`nps-pill ${answers[q.id] === s ? 'selected' : ''}`}
                    onClick={() => setAnswers({ ...answers, [q.id]: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="t-12 glass-text-3 uppercase mb-6">Anything you'd like to share (optional)</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="A sentence or two about your experience…"
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(180,170,230,0.18)',
              borderRadius: 10,
              padding: '10px 12px',
              color: 'var(--dtext-1)',
              fontFamily: 'inherit',
              fontSize: 13,
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        <div className="row gap-10 mt-24" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost-dark" onClick={onCancel}>Skip</button>
          <button className="btn btn-primary" onClick={() => onSubmit({ text, answers })}>Submit feedback</button>
        </div>
      </div>
    </div>
  );
}

function ClaudeModal({ pr, onClose }) {
  const prompt = `Review PR #${pr.id} in ${pr.repo}. Focus on the AI suggestions flagged as High and Medium severity. Surface code changes and test cases before human review.`;
  const [copied, setCopied] = rUS(false);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="glass p-24 bounce-in" style={{ maxWidth: 560, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="row gap-10 mb-12">
          <div className="row center" style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(107,107,255,0.22)', color: '#B5B5FF' }}>
            <Icon name="code" className="ic ic-sm" />
          </div>
          <div className="t-16 w-600 glass-text-1">Prompt for Claude Code</div>
        </div>
        <div className="t-12 glass-text-2" style={{ lineHeight: 1.55 }}>
          Open Claude Code in your editor and paste this prompt to keep iterating on the suggestions Chico flagged.
        </div>
        <div className="glass-inset-code mt-16">{prompt}</div>
        <div className="row gap-10 mt-16" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost-dark" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => { navigator.clipboard?.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            <Icon name="copy" className="ic ic-sm" /> {copied ? 'Copied' : 'Copy prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}

const PageReview = ({ ctx, prId }) => {
  const id = prId || 184;
  const pr = window.PRS.find(p => p.id === id) || window.PRS[0];
  const files = window.PR_FILES[id] || [];
  const staticSugs = window.PR_SUGGESTIONS[id] || [];
  const isInteractive = id === 184;
  const readOnly = ctx.user.role === 'manager';

  const [activeFile, setActiveFile] = rUS(files[0]?.name || '');
  const [thumbsDownFor, setThumbsDownFor] = rUS(null);
  const [showClaude, setShowClaude] = rUS(false);
  const [showNPS, setShowNPS] = rUS(false);
  const [hoveredLine, setHoveredLine] = rUS(null);
  // Editable code: a draft for the active file. null means "no unsaved edits".
  const [editDraft, setEditDraft] = rUS(null);
  rUE(() => { setEditDraft(null); }, [activeFile, id]);
  // Once review is requested, lock the button until the user navigates away.
  const [reviewRequested, setReviewRequested] = rUS(false);
  rUE(() => { setReviewRequested(false); }, [id]);

  // Score state: interactive only for PR#184
  const score = isInteractive ? ctx.pr184.score : pr.score;
  const actions = isInteractive ? ctx.pr184.actions : {};
  const feedback = isInteractive ? (ctx.pr184.feedback || {}) : {};

  const [scoreDisplay, setScoreDisplay] = rUS(score);
  const [scoreBounce, setScoreBounce] = rUS(false);
  rUE(() => {
    if (scoreDisplay === score) return;
    setScoreBounce(true);
    window.tweenNumber(scoreDisplay, score, 600, v => setScoreDisplay(v), () => setTimeout(() => setScoreBounce(false), 50));
  }, [score]);
  rUE(() => { setScoreDisplay(score); }, [id]); // reset on PR change

  const readiness = window.readinessFromScore(score);
  const isReady = score >= 90;

  const act = (s, kind) => {
    if (!isInteractive || readOnly) return;
    if (actions[s.id]) return;
    const delta = window.SCORE_DELTAS[s.severity];
    const inc = kind === 'accepted' ? delta.accept : 0; // decline = 0 score change
    const newScore = Math.min(100, score + inc);

    // Apply the code patch only on accept.
    const patch = kind === 'accepted' && window.SUGGESTION_PATCHES[id] && window.SUGGESTION_PATCHES[id][s.id];

    ctx.setPr184(prev => {
      const nextOverrides = { ...(prev.fileOverrides || {}) };
      const snapshot = { scoreDelta: newScore - prev.score };
      if (patch) {
        snapshot.file = patch.file;
        snapshot.prevFileContent = nextOverrides[patch.file];
        const currentCode = nextOverrides[patch.file] !== undefined
          ? nextOverrides[patch.file]
          : (window.PR_FILES[id].find(f => f.name === patch.file)?.code || '');
        try { nextOverrides[patch.file] = patch.apply(currentCode); } catch (e) { /* ignore */ }
      }
      return {
        ...prev,
        actions: { ...prev.actions, [s.id]: kind },
        score: newScore,
        fileOverrides: nextOverrides,
        undoStore: { ...(prev.undoStore || {}), [s.id]: snapshot },
      };
    });

    if (patch && patch.file !== activeFile) setActiveFile(patch.file);

    if (kind === 'accepted') {
      ctx.pushToast(
        'Suggestion accepted',
        inc > 0 ? `Readiness improved from ${score} to ${newScore}` : 'Logged.',
      );
      if (newScore >= 90 && score < 90) {
        setTimeout(() => ctx.pushToast('Ready for human review', 'This PR is now likely to pass review with fewer cycles.'), 600);
      }
    } else if (kind === 'declined') {
      ctx.pushToast('Suggestion declined', 'Logged.');
    }
  };

  // Thumbs are feedback (separate from primary action). They toggle independently
  // and never collapse the action row or trigger Undo.
  const thumbsUp = (s) => {
    if (!isInteractive || readOnly) return;
    ctx.setPr184(prev => {
      const current = (prev.feedback || {})[s.id];
      const nextFeedback = { ...(prev.feedback || {}) };
      const nextThumbsDownFeedback = { ...(prev.thumbsDownFeedback || {}) };
      if (current === 'thumbs_up') {
        delete nextFeedback[s.id];
      } else {
        nextFeedback[s.id] = 'thumbs_up';
        delete nextThumbsDownFeedback[s.id];
      }
      return { ...prev, feedback: nextFeedback, thumbsDownFeedback: nextThumbsDownFeedback };
    });
  };
  const thumbsDown = (s) => {
    if (!isInteractive || readOnly) return;
    const current = (ctx.pr184.feedback || {})[s.id];
    if (current === 'thumbs_down') {
      // Already active — toggle off without opening the modal.
      ctx.setPr184(prev => {
        const nextFeedback = { ...(prev.feedback || {}) }; delete nextFeedback[s.id];
        const nextThumbsDownFeedback = { ...(prev.thumbsDownFeedback || {}) }; delete nextThumbsDownFeedback[s.id];
        return { ...prev, feedback: nextFeedback, thumbsDownFeedback: nextThumbsDownFeedback };
      });
      return;
    }
    setThumbsDownFor(s);
  };
  const confirmThumbsDown = ({ reason, details }) => {
    if (!isInteractive || readOnly) { setThumbsDownFor(null); return; }
    const s = thumbsDownFor;
    ctx.setPr184(prev => ({
      ...prev,
      feedback: { ...(prev.feedback || {}), [s.id]: 'thumbs_down' },
      thumbsDownFeedback: { ...(prev.thumbsDownFeedback || {}), [s.id]: { reason, details } },
    }));
    setThumbsDownFor(null);
    ctx.pushToast('Feedback sent', 'Thanks — that helps us improve.');
  };
  const undo = (s) => {
    if (!isInteractive || readOnly) return;
    ctx.setPr184(prev => {
      const snap = (prev.undoStore || {})[s.id];
      const prevAction = prev.actions[s.id];
      if (!snap && !prevAction) return prev;
      const nextActions = { ...prev.actions }; delete nextActions[s.id];
      const nextOverrides = { ...(prev.fileOverrides || {}) };
      if (snap && snap.file !== undefined) {
        if (snap.prevFileContent === undefined) {
          delete nextOverrides[snap.file];
        } else {
          nextOverrides[snap.file] = snap.prevFileContent;
        }
      }
      const nextUndoStore = { ...(prev.undoStore || {}) }; delete nextUndoStore[s.id];
      const newScore = Math.max(0, prev.score - ((snap && snap.scoreDelta) || 0));
      // Feedback (thumbs) is independent of the primary action and persists across undo.
      return {
        ...prev,
        actions: nextActions,
        score: newScore,
        fileOverrides: nextOverrides,
        undoStore: nextUndoStore,
      };
    });
    ctx.pushToast('Action undone', 'Suggestion is back to pending.');
  };

  // ---- Code editing (left panel) ----
  const baseFile = files.find(f => f.name === activeFile);
  const baseCode = isInteractive
    ? (ctx.pr184.fileOverrides?.[activeFile] ?? baseFile?.code ?? '')
    : (baseFile?.code ?? '');
  const displayCode = editDraft !== null ? editDraft : baseCode;
  const hasEdits = editDraft !== null && editDraft !== baseCode;

  const handleEdit = (newCode) => setEditDraft(newCode);
  const handleSave = () => {
    if (!isInteractive || readOnly || editDraft === null) return;
    ctx.setPr184(prev => ({
      ...prev,
      fileOverrides: { ...(prev.fileOverrides || {}), [activeFile]: editDraft },
    }));
    setEditDraft(null);
    ctx.pushToast('File saved', `${activeFile.split('/').pop()} updated.`);
  };

  // ---- Request review (with NPS trigger for PR 176) ----
  const requestReview = () => {
    if (reviewRequested) return;
    if (id === 176) {
      setShowNPS(true);
    } else {
      setReviewRequested(true);
      ctx.pushToast('Human review requested', `Reviewers on ${pr.team} have been notified.`);
    }
  };
  const submitNPS = ({ text, answers }) => {
    setShowNPS(false);
    setReviewRequested(true);
    ctx.pushToast('Thanks for the feedback', `Review requested. ${Object.keys(answers).length} answer${Object.keys(answers).length === 1 ? '' : 's'} logged.`);
  };
  const skipNPS = () => {
    setShowNPS(false);
    setReviewRequested(true);
    ctx.pushToast('Human review requested', `Reviewers on ${pr.team} have been notified.`);
  };

  // Suggestions for active file (with synthetic statuses for non-interactive PRs)
  const fileSugs = staticSugs.filter(s => s.file === activeFile);
  // For non-interactive PRs, mark all as "accepted" so they appear historical
  const getAction = (s) => isInteractive ? actions[s.id] : (id === 176 ? 'accepted' : (id === 178 && s.id === 1 ? 'accepted' : undefined));

  const allCount = staticSugs.length;
  const accCount = isInteractive
    ? Object.values(actions).filter(v => v === 'accepted').length
    : staticSugs.filter(s => getAction(s)).length;

  return (
    <div className="col gap-16">
      {/* TOP CARD — compact */}
      <div className="pillow p-20">
        <div className="row gap-20 wrap" style={{ alignItems: 'center' }}>
          <div className="row center" style={{ flex: '0 0 auto' }}>
            <div className={`score-ring ${scoreBounce ? 'score-bounce' : ''}`} style={{ '--p': scoreDisplay, '--size': '72px', fontSize: 18 }}>
              <span>{scoreDisplay}</span>
            </div>
          </div>

          <div className="flex-1" style={{ minWidth: 280 }}>
            <div className="row gap-8 wrap mb-4">
              <span className={`pill ${window.readinessPillClass(readiness)}`}>{window.readinessLabel(readiness)}</span>
              <span className="t-12 text-3 mono">#{pr.id} · {pr.repo}</span>
              <span className="t-12 text-3">{pr.branch}</span>
              <span className={`pill ${pr.reviewStatus === 'Approved' ? 'pill-good' : pr.reviewStatus === 'Changes requested' ? 'pill-risk' : 'pill-neutral'}`}>{pr.reviewStatus}</span>
            </div>
            <div className="t-20 text-1" style={{ lineHeight: 1.25 }}>{pr.title}</div>
            <div className="row gap-12 mt-6 t-12 text-3 wrap">
              <span><Icon name="user" className="ic ic-sm" style={{ verticalAlign: '-2px', marginRight: 4 }} />{pr.author}</span>
              <span>·</span>
              <span>{pr.team} team</span>
              <span>·</span>
              <span>opened {pr.opened}</span>
              <span>·</span>
              <span>{allCount} AI suggestions · {accCount} acted on</span>
            </div>
          </div>

          <div className="row gap-8 wrap" style={{ flex: '0 0 auto' }}>
            <button className="btn btn-pillow btn-sm" onClick={() => ctx.navigate(ctx.user.role === 'manager' ? 'queue' : 'prlist')}>
              <Icon name="chevR" className="ic ic-sm" style={{ transform: 'rotate(180deg)' }} /> Back
            </button>
            <button className="btn btn-pillow btn-sm"><Icon name="external" className="ic ic-sm" /> Open in GitHub</button>
            {!readOnly && (
              <button className="btn btn-pillow btn-sm" onClick={() => setShowClaude(true)}>
                <Icon name="code" className="ic ic-sm" /> Open in Claude Code
              </button>
            )}
            {readOnly ? (
              <button className="btn btn-primary btn-sm" onClick={() => ctx.pushToast('PR approved', `${pr.author} will be notified.`)}>
                <Icon name="check" className="ic ic-sm" /> Approve
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" disabled={!isReady || reviewRequested} onClick={requestReview}>
                <Icon name="user" className="ic ic-sm" /> {reviewRequested ? 'Review requested' : 'Request review'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 50/50 split — both panels stretch to the height of the taller */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
        {/* LEFT — code + file switcher */}
        <div className="pillow p-16" style={{ minWidth: 0 }}>
          {/* file tabs */}
          <div className="file-tabs">
            {files.map(f => (
              <button
                key={f.name}
                className={`file-tab ${activeFile === f.name ? 'active' : ''}`}
                onClick={() => setActiveFile(f.name)}
              >
                <Icon name={f.isDescription ? 'book' : 'file'} className="ic ic-sm" />
                <span className="mono">{f.name.split('/').pop()}</span>
                {staticSugs.filter(s => s.file === f.name).length > 0 && (
                  <span className="file-tab-badge">{staticSugs.filter(s => s.file === f.name).length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="t-12 text-3 mt-10 mb-8 mono" style={{ paddingLeft: 6 }}>{activeFile}</div>

          {/* code */}
          <div className="pillow-inset" style={{ borderRadius: 14, overflow: 'hidden' }}>
            {baseFile && baseFile.isDescription ? (
              isInteractive && !readOnly ? (
                <textarea
                  className="desc-editor"
                  value={displayCode}
                  onChange={(e) => handleEdit(e.target.value)}
                  rows={Math.max(displayCode.split('\n').length, 3)}
                  spellCheck={false}
                />
              ) : (
                <div style={{ padding: '18px 22px', fontSize: 14, lineHeight: 1.65, color: 'var(--text-1)', whiteSpace: 'pre-wrap' }}>
                  {displayCode}
                </div>
              )
            ) : baseFile ? (
              <CodeView
                code={displayCode}
                file={baseFile.name}
                suggestions={fileSugs}
                onSuggestionHover={(sid) => setHoveredLine(sid)}
                focusedSugId={hoveredLine}
                editable={isInteractive && !readOnly}
                onChange={handleEdit}
              />
            ) : null}
          </div>

          {/* Save button — only when there are unsaved edits */}
          {hasEdits && (
            <div className="row mt-12" style={{ justifyContent: 'flex-end' }}>
              <button className="btn-save" onClick={handleSave}>
                <Icon name="save" className="ic ic-sm" /> Save
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — suggestions for current file */}
        <div className="glass" style={{ minWidth: 0 }}>
          <div style={{ padding: 16, borderBottom: '1px solid rgba(180,170,230,0.14)' }}>
            <div className="between">
              <div className="row gap-10">
                <div className="row center" style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(107,107,255,0.22)', color: '#B5B5FF' }}>
                  <Icon name="spark" className="ic ic-sm" />
                </div>
                <div>
                  <div className="t-14 w-600 glass-text-1">AI suggestions</div>
                  <div className="t-12 glass-text-3 mono">{activeFile.split('/').pop()}</div>
                </div>
              </div>
              <div className="t-12 glass-text-3">{fileSugs.length} {fileSugs.length === 1 ? 'suggestion' : 'suggestions'}</div>
            </div>

            {/* Mini readiness breakdown */}
            <div className="row gap-6 mt-12 wrap">
              <BreakdownChip label="Tests"      good={isReady} />
              <BreakdownChip label="Edge cases" good={isReady} />
              <BreakdownChip label="PR context" good={isReady} />
              <BreakdownChip label="Code clarity" good />
              <BreakdownChip label="CI" good labelGood="Passing" labelBad="Failing" />
            </div>
          </div>

          <div style={{ padding: 16 }}>
            {fileSugs.length === 0 ? (
              <div style={{ padding: '32px 14px', textAlign: 'center' }}>
                <div className="row center" style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(79,184,155,0.18)', color: '#87D6BC', margin: '0 auto 12px' }}>
                  <Icon name="check" className="ic" />
                </div>
                <div className="t-14 w-500 glass-text-1">No suggestions for this file</div>
                <div className="t-12 glass-text-3 mt-6" style={{ maxWidth: 280, margin: '6px auto 0', lineHeight: 1.55 }}>
                  Chico didn't find readiness issues here. Switch to another file to see what needs attention.
                </div>
              </div>
            ) : (
              <div className="col gap-12">
                {fileSugs.map(s => (
                  <SuggestionBlock
                    key={s.id}
                    s={s}
                    action={getAction(s)}
                    feedback={feedback[s.id]}
                    readOnly={readOnly || !isInteractive}
                    onAct={act}
                    onThumbsUp={thumbsUp}
                    onThumbsDown={thumbsDown}
                    onUndo={undo}
                    onHoverLine={setHoveredLine}
                    focused={hoveredLine === s.id}
                  />
                ))}
              </div>
            )}

            {/* When ready, success block */}
            {isInteractive && isReady && (
              <div className="glass-sub p-16 mt-16 bounce-in" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="lumi-edge" style={{ opacity: 0.6 }} />
                <div className="row gap-10 mb-6">
                  <div className="row center" style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(79, 184, 155, 0.22)', color: '#87D6BC' }}>
                    <Icon name="check" className="ic ic-sm" />
                  </div>
                  <div className="t-14 w-600 glass-text-1">Ready for human review</div>
                </div>
                <div className="t-12 glass-text-2" style={{ lineHeight: 1.55 }}>
                  This PR is likely to pass review with fewer cycles.
                </div>
                <div className="row gap-8 mt-10 wrap">
                  <button className="btn btn-primary btn-xs" disabled={reviewRequested} onClick={requestReview}>
                    {reviewRequested ? 'Review requested' : 'Request review'}
                  </button>
                  <button className="btn btn-ghost-dark btn-xs" onClick={() => setShowClaude(true)}><Icon name="code" className="ic ic-sm" /> Claude Code</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {thumbsDownFor && <ThumbsDownModal s={thumbsDownFor} onCancel={() => setThumbsDownFor(null)} onConfirm={confirmThumbsDown} />}
      {showClaude && <ClaudeModal pr={pr} onClose={() => setShowClaude(false)} />}
      {showNPS && <NPSModal pr={pr} onCancel={skipNPS} onSubmit={submitNPS} />}
    </div>
  );
};

function BreakdownChip({ label, good, labelGood = 'Good', labelBad = 'Needs work' }) {
  return (
    <span className={`pill-dark ${good ? 'pill-good' : 'pill-warn'}`}>
      <span style={{ opacity: 0.8 }}>{label}:</span>
      <span style={{ fontWeight: 600 }}>{good ? labelGood : labelBad}</span>
    </span>
  );
}

window.PageReview = PageReview;
