// App shell — top horizontal tabs, user-pill identity switcher, role-scoped routing

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// =============== Blog post catalog ===============
const BLOG_POSTS = [
  { slug: 'presentation', short: 'Presentation', sub: 'About this app' },
  { slug: 'expanding',    short: 'Expanding',    sub: 'Readiness beyond PRs' },
];
const VALID_SLUGS = BLOG_POSTS.map(p => p.slug);
const DEFAULT_BLOG_SLUG = 'presentation';
const BLOG_POSTS_BY_SLUG = Object.fromEntries(BLOG_POSTS.map(p => [p.slug, p]));

function parseBlogPath(pathname) {
  // Returns slug if pathname is /blog/<known-slug>, else null
  const m = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (m && VALID_SLUGS.includes(m[1])) return m[1];
  return null;
}

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
const FROSTED_AVATAR = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.78), rgba(221,231,247,0.62) 55%, rgba(232,228,245,0.7))',
  backdropFilter: 'blur(10px) saturate(160%)',
  WebkitBackdropFilter: 'blur(10px) saturate(160%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 6px -2px rgba(42,36,56,0.18)',
};

function TopBar({ user, switchUser, page, setPage, blogSlug, goToBlog }) {
  const [open, setOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const tabs = TABS[user.role];
  const ref = useRef(null);
  const brandRef = useRef(null);
  const postRef = useRef(null);

  // When viewing a PR detail, keep the parent list tab highlighted
  const activeTab = page === 'prdetail'
    ? (user.role === 'manager' ? 'queue' : 'prlist')
    : page;

  // Blog pages are their own surface — no tabs, no user pill
  const isBlog = page === 'blog';
  const currentPost = BLOG_POSTS_BY_SLUG[blogSlug] || BLOG_POSTS_BY_SLUG[DEFAULT_BLOG_SLUG];

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
      if (postRef.current && !postRef.current.contains(e.target)) setPostOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="topbar-bar">
      <div className="topbar-inner">
        <div className="row gap-16" style={{ alignItems: 'center' }}>
        <div ref={brandRef} style={{ position: 'relative' }}>
          <button
            className="brand-button"
            onClick={() => setBrandOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={brandOpen}
          >
            <img src="assets/chico-bear.png" alt="chico.ai" className="chico-bear" style={{ width: 40, height: 40, display: 'block' }} />
            <div>
              <div className="t-14 w-600 text-1" style={{ lineHeight: 1.1 }}>chico.ai</div>
              <div className="t-12 text-3" style={{ lineHeight: 1.1 }}>{isBlog ? 'Blog' : 'PR Readiness'}</div>
            </div>
          </button>

          {brandOpen && (
            <div className="brand-menu bounce-in" style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              minWidth: 260, padding: 10, zIndex: 50,
            }}>
              <div className="t-12 glass-text-3 uppercase" style={{ padding: '6px 10px 8px' }}>Go to</div>
              <button
                className="user-menu-item"
                onClick={() => {
                  if (isBlog) setPage(user.role === 'manager' ? 'dashboard' : 'prlist');
                  setBrandOpen(false);
                }}
              >
                <div className="row center" style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(107,107,255,0.18)', color: '#6B6BFF' }}>
                  <Icon name="queue" className="ic ic-sm" />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div className="t-14 w-500 glass-text-1" style={{ lineHeight: 1.15 }}>PR Review</div>
                  <div className="t-12 glass-text-3">The app</div>
                </div>
                {!isBlog && (
                  <span className="pill pill-good"><Icon name="check" className="ic ic-sm" /></span>
                )}
              </button>
              <button
                className="user-menu-item"
                onClick={() => {
                  if (!isBlog) setPage('blog');
                  setBrandOpen(false);
                }}
              >
                <div className="row center" style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(107,107,255,0.18)', color: '#6B6BFF' }}>
                  <Icon name="book" className="ic ic-sm" />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div className="t-14 w-500 glass-text-1" style={{ lineHeight: 1.15 }}>Blog</div>
                  <div className="t-12 glass-text-3">Behind the prototype</div>
                </div>
                {isBlog && (
                  <span className="pill pill-good"><Icon name="check" className="ic ic-sm" /></span>
                )}
              </button>
            </div>
          )}
        </div>

        {!isBlog && (
          <div style={{ width: 1, height: 26, background: 'rgba(200,194,217,0.4)' }}></div>
        )}

        {/* Horizontal tabs */}
        {!isBlog && (
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
        )}

        <div style={{ marginLeft: 'auto' }} className="row gap-10">
          {/* Blog post pill — when on blog, replaces the user pill */}
          {isBlog && (
            <div ref={postRef} style={{ position: 'relative' }}>
              <button
                className="user-pill"
                onClick={() => setPostOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={postOpen}
              >
                <div className="row center" style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(107,107,255,0.18)', color: '#6B6BFF',
                }}>
                  <Icon name="book" className="ic ic-sm" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div className="t-12 w-600 text-1" style={{ lineHeight: 1.1 }}>{currentPost.short}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', lineHeight: 1.1 }}>Blog post</div>
                </div>
                <Icon name={postOpen ? 'up' : 'down'} className="ic ic-sm" />
              </button>

              {postOpen && (
                <div className="user-menu bounce-in" style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  minWidth: 260, padding: 10, zIndex: 50,
                }}>
                  <div className="t-12 glass-text-3 uppercase" style={{ padding: '6px 10px 8px' }}>Switch post</div>
                  {BLOG_POSTS.map(p => (
                    <button
                      key={p.slug}
                      className="user-menu-item"
                      onClick={() => {
                        if (p.slug !== blogSlug) goToBlog(p.slug);
                        setPostOpen(false);
                      }}
                    >
                      <div className="row center" style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(107,107,255,0.18)', color: '#6B6BFF' }}>
                        <Icon name="book" className="ic ic-sm" />
                      </div>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div className="t-14 w-500 glass-text-1" style={{ lineHeight: 1.15 }}>{p.short}</div>
                        <div className="t-12 glass-text-3">{p.sub}</div>
                      </div>
                      {p.slug === blogSlug && (
                        <span className="pill pill-good"><Icon name="check" className="ic ic-sm" /></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* User pill — clickable to switch identity */}
          {!isBlog && (
          <div ref={ref} style={{ position: 'relative' }}>
            <button
              className="user-pill"
              onClick={() => setOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <div className="row center" style={{
                width: 30, height: 30, borderRadius: '50%',
                color: 'var(--text-1)', fontSize: 12, fontWeight: 600,
                ...FROSTED_AVATAR,
              }}>{user.initials}</div>
              <div style={{ textAlign: 'left' }}>
                <div className="t-12 w-600 text-1" style={{ lineHeight: 1.1 }}>{user.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', lineHeight: 1.1, textTransform: 'capitalize' }}>{user.team} · {user.role}</div>
              </div>
              <Icon name={open ? 'up' : 'down'} className="ic ic-sm" />
            </button>

            {open && (
              <div className="user-menu bounce-in" style={{
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
                      color: 'var(--text-1)', fontSize: 11, fontWeight: 600,
                      ...FROSTED_AVATAR,
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
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
   </div>
  );
}
function App() {
  // Persisted login — restore userId from localStorage if present and valid
  const [userId, setUserId] = useState(() => {
    try {
      const saved = localStorage.getItem('chico_userId');
      if (saved && window.USERS[saved]) return saved;
    } catch (e) { /* ignore */ }
    return 'maya';
  });
  useEffect(() => {
    try { localStorage.setItem('chico_userId', userId); } catch (e) { /* ignore */ }
  }, [userId]);

  const user = window.USERS[userId];

  // Default page per role
  const defaultPage = user.role === 'manager' ? 'dashboard' : 'prlist';

  // Initial page + blog slug derived from URL
  const initialSlugFromUrl = typeof window !== 'undefined'
    ? parseBlogPath(window.location.pathname)
    : null;
  const [page, setPage] = useState(initialSlugFromUrl ? 'blog' : defaultPage);
  const [blogSlug, setBlogSlug] = useState(initialSlugFromUrl || DEFAULT_BLOG_SLUG);
  const [currentPrId, setCurrentPrId] = useState(null);

  // Keep the URL in sync with page + blog slug
  useEffect(() => {
    const expected = page === 'blog' ? `/blog/${blogSlug}` : '/';
    if (window.location.pathname !== expected) {
      window.history.pushState(null, '', expected);
    }
  }, [page, blogSlug]);

  // Browser back/forward handling
  useEffect(() => {
    function onPop() {
      const slug = parseBlogPath(window.location.pathname);
      setCurrentPrId(null);
      if (slug) {
        setBlogSlug(slug);
        setPage('blog');
      } else {
        setPage(prev => (prev === 'blog' ? defaultPage : prev));
      }
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [defaultPage]);

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

  const goToBlog = useCallback((slug) => {
    setBlogSlug(slug);
    setPage('blog');
    setCurrentPrId(null);
  }, []);

  const ctx = { user, toasts, pushToast, dismiss, pr184, setPr184, navigate, openPR, currentPrId, setCurrentPrId, blogSlug, goToBlog };

  return (
    <div className="app-shell">
      <TopBar user={user} switchUser={switchUser} page={page} setPage={(p) => { setPage(p); setCurrentPrId(null); }} blogSlug={blogSlug} goToBlog={goToBlog} />
      <div className="main-wide">
        <div key={page + blogSlug + (currentPrId || '')} className="page-fade">
          {page === 'dashboard' && user.role === 'manager' && <window.PageDashboard ctx={ctx} />}
          {page === 'queue'     && user.role === 'manager' && <window.PageQueue ctx={ctx} />}
          {page === 'prlist'    && user.role === 'developer' && <window.PagePrList ctx={ctx} />}
          {page === 'prdetail'  && <window.PageReview ctx={ctx} prId={currentPrId} />}
          {page === 'roi'       && <window.PageROI ctx={ctx} />}
          {page === 'blog'      && <window.PageBlog ctx={ctx} slug={blogSlug} />}
        </div>
      </div>
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

window.App = App;
