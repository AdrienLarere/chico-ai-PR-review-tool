// App shell — top horizontal tabs, user-pill identity switcher, role-scoped routing

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// =============== Toast Stack ===============
function ToastStack({ toasts, dismiss }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="glass toast" style={{ padding: '12px 16px', minWidth: 280 }}>
          <div className="row gap-10">
            <div className="row center" style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(107,107,255,0.22)', color: '#B5B5FF' }}>
              <Icon name="spark" className="ic ic-sm" />
            </div>
            <div className="flex-1">
              <div className="t-14 w-500 glass-text-1">{t.title}</div>
              {t.sub && <div className="t-12 glass-text-3 mt-4">{t.sub}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} style={{ background: 'transparent', border: 'none', color: 'var(--dtext-3)', padding: 4, cursor: 'pointer' }}>
              <Icon name="x" className="ic ic-sm" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============== Role-scoped tab set ===============
const TABS = {
  developer: [
    { id: 'prlist',  label: 'My PRs',           icon: 'queue' },
    { id: 'roi',     label: 'Team Performance', icon: 'chart' },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard',       icon: 'dashboard' },
    { id: 'queue',     label: 'PR Queue',        icon: 'queue' },
    { id: 'roi',       label: 'Team Performance', icon: 'chart' },
  ],
};

// =============== Top Bar ===============
function TopBar({ user, switchUser, page, setPage }) {
  const [open, setOpen] = useState(false);
  const tabs = TABS[user.role];
  const ref = useRef(null);

  // When viewing a PR detail, keep the parent list tab highlighted
  const activeTab = page === 'prdetail'
    ? (user.role === 'manager' ? 'queue' : 'prlist')
    : page;

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="topbar-bar">
      <div className="topbar-inner">
        <div className="row gap-16" style={{ alignItems: 'center' }}>
        <div className="row gap-10">
          <div className="row center" style={{
            width: 34, height: 34, borderRadius: 11,
            background: 'rgba(26,22,38,0.92)', color: '#B5B5FF',
            boxShadow: '0 6px 14px -4px rgba(26,22,38,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
            <Icon name="monogram" className="ic" />
          </div>
          <div>
            <div className="t-14 w-600 text-1" style={{ lineHeight: 1.1 }}>Chico</div>
            <div className="t-12 text-3" style={{ lineHeight: 1.1 }}>PR Readiness</div>
          </div>
        </div>

        <div style={{ width: 1, height: 26, background: 'rgba(200,194,217,0.4)' }}></div>

        {/* Horizontal tabs */}
        <nav className="row gap-6" style={{ alignItems: 'center' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`top-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setPage(t.id)}
            >
              <Icon name={t.icon} className="ic ic-sm" />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto' }} className="row gap-10">
          {/* User pill — clickable to switch identity */}
          <div ref={ref} style={{ position: 'relative' }}>
            <button
              className="user-pill"
              onClick={() => setOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <div className="row center" style={{
                width: 30, height: 30, borderRadius: '50%',
                background: '#1A1626',
                color: 'white', fontSize: 12, fontWeight: 600,
              }}>{user.initials}</div>
              <div style={{ textAlign: 'left' }}>
                <div className="t-12 w-600 text-1" style={{ lineHeight: 1.1 }}>{user.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', lineHeight: 1.1, textTransform: 'capitalize' }}>{user.team} · {user.role}</div>
              </div>
              <Icon name={open ? 'up' : 'down'} className="ic ic-sm" />
            </button>

            {open && (
              <div className="glass user-menu bounce-in" style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                minWidth: 260, padding: 10, zIndex: 50,
              }}>
                <div className="t-12 glass-text-3 uppercase" style={{ padding: '6px 10px 8px' }}>Switch identity (demo)</div>
                {Object.values(window.USERS).map(u => (
                  <button
                    key={u.id}
                    className="user-menu-item"
                    onClick={() => { switchUser(u.id); setOpen(false); }}
                  >
                    <div className="row center" style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#1A1626',
                      color: 'white', fontSize: 11, fontWeight: 600,
                    }}>{u.initials}</div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div className="t-14 w-500 glass-text-1" style={{ lineHeight: 1.15 }}>{u.name}</div>
                      <div className="t-12 glass-text-3" style={{ textTransform: 'capitalize' }}>{u.team} · {u.role}</div>
                    </div>
                    {u.id === user.id && (
                      <span className="pill-dark pill-good"><Icon name="check" className="ic ic-sm" /> Active</span>
                    )}
                  </button>
                ))}
                <div className="divider-dark" style={{ margin: '6px 0' }}></div>
                <div className="t-12 glass-text-3" style={{ padding: '6px 10px', lineHeight: 1.5 }}>
                  Each identity sees only the tabs and actions appropriate to their role.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
   </div>
  );
}
function App() {
  const [userId, setUserId] = useState('maya');
  const user = window.USERS[userId];

  // Default page per role
  const defaultPage = user.role === 'manager' ? 'dashboard' : 'prlist';
  const [page, setPage] = useState(defaultPage);
  const [currentPrId, setCurrentPrId] = useState(null);

  const switchUser = useCallback((id) => {
    setUserId(id);
    const nextRole = window.USERS[id].role;
    setPage(nextRole === 'manager' ? 'dashboard' : 'prlist');
    setCurrentPrId(null);
  }, []);

  // PR184 interactive state
  const [pr184, setPr184] = useState({
    score: 72,
    actions: {},
    declineReasons: {},
    initialScore: 72,
  });

  // Toasts
  const [toasts, setToasts] = useState([]);
  const pushToast = useCallback((title, sub) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, title, sub }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  const dismiss = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // Open PR (from list or queue) → detail
  const openPR = useCallback((prId) => {
    setCurrentPrId(prId);
    setPage('prdetail');
  }, []);

  const navigate = useCallback((target) => {
    if (target === 'queue' && user.role === 'developer') { setPage('prlist'); return; }
    setPage(target);
  }, [user.role]);

  const ctx = { user, toasts, pushToast, dismiss, pr184, setPr184, navigate, openPR, currentPrId, setCurrentPrId };

  return (
    <div className="app-shell">
      <TopBar user={user} switchUser={switchUser} page={page} setPage={(p) => { setPage(p); setCurrentPrId(null); }} />
      <div className="main-wide">
        <div key={page + (currentPrId || '')} className="page-fade">
          {page === 'dashboard' && user.role === 'manager' && <window.PageDashboard ctx={ctx} />}
          {page === 'queue'     && user.role === 'manager' && <window.PageQueue ctx={ctx} />}
          {page === 'prlist'    && user.role === 'developer' && <window.PagePrList ctx={ctx} />}
          {page === 'prdetail'  && <window.PageReview ctx={ctx} prId={currentPrId} />}
          {page === 'roi'       && <window.PageROI ctx={ctx} />}
        </div>
      </div>
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

window.App = App;
