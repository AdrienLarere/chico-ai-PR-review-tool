// Blog — single-post layout. Post switching happens via the navbar pill (see app.jsx).

// =============== Post content ===============

function PostPresentation() {
  return (
    <>
      <p className="lead">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <hr />

      <div className="eyebrow">Section 1</div>
      <h2>The problem</h2>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
      </p>
      <p>
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
      </p>

      <div className="eyebrow">Section 2</div>
      <h2>How chico.ai works</h2>
      <p>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
      </p>
      <p>
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
      </p>

      <div className="eyebrow">Section 3</div>
      <h2>What this prototype shows</h2>
      <p>
        Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
      </p>
      <p>
        Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum.
      </p>

      <div className="eyebrow">Section 4</div>
      <h2>What comes next</h2>
      <p>
        Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.
      </p>
    </>
  );
}

function PostMeta() {
  return (
    <>
      <p className="lead">
        My first instinct was to skip past the obvious task of <em>designing a feature for a specific user</em>. The interesting problem sits upstream of that — building the engine that lets the right person at any company shape their own version of it.
      </p>
      <hr />

      <div className="eyebrow">Section 1</div>
      <h2>Why an engine, not an app</h2>
      <p>
        Every business has a slightly different version of the same motion: <strong>make this output ready before a human looks at it.</strong> Pull requests. Specifications. Sales call briefs. Support tickets. Incident write-ups. Quarterly reports. Designing a tool around any one of those traps the team in someone else's shape — and the shape is almost always wrong by a few inches.
      </p>
      <p>
        The interesting bet is on the layer underneath: a scoring loop, a suggestion pipeline, role-scoped surfaces, telemetry on what gets accepted and ignored. Everything visible in this prototype is a particular configuration of that loop, not the loop itself.
      </p>

      <div className="eyebrow">Section 2</div>
      <h2>Who builds it</h2>
      <p>
        The right collaborator is what I'd call an <strong>AI lead</strong> — someone inside the company who knows the work intimately and is empowered to co-build with us and an AI. Sometimes this is a permanent role, sometimes a temporary one created for the engagement. Either way, the crucial thing is authority: they get to define what "ready" means in their domain, and they can iterate on it without a months-long product cycle on our side.
      </p>
      <p>
        Without that person, every implementation drifts back into a generic dashboard. With them, the rubric stays alive. They notice when "high readiness, slow approval" is the actual signal worth chasing this quarter, and they tune the surfaces to put that pattern in front of the manager.
      </p>

      <div className="eyebrow">Section 3</div>
      <h2>What chico.ai actually is</h2>
      <p>
        A scaffolding for that collaboration. It hands the AI lead the building blocks — readiness scoring, suggestion pipelines, role-scoped surfaces, telemetry — and then gets out of the way. The PR Readiness demo you see in this prototype is what came out when we ran that engine for an engineering team.
      </p>
      <p>
        Run it for legal, sales, support, or finance and the surfaces would look different, but the contract underneath is the same: produce, score, suggest, accept or fix, ship. Everything else is configuration.
      </p>

      <div className="eyebrow">Section 4</div>
      <h2>The bet</h2>
      <p>
        That generality wins. A feature for one person can be cloned in a quarter. An engine that turns a domain expert inside a company into a software author for their own team is harder to copy, because the moat is the relationship with the AI lead, not the rectangles on the screen.
      </p>
      <p>
        Put differently: the defensible thing is the engine plus the people we partner with to run it — not this prototype.
      </p>
    </>
  );
}

function PostExpanding() {
  return (
    <>
      <p className="lead">
        PR Readiness is one shape of a more general motion: give a person a scored, fixable preview of their work before a reviewer has to react to it. The same loop fits a much wider set of work products and a much wider set of industries.
      </p>
      <hr />

      <div className="eyebrow">Section 1</div>
      <h2>What "readiness" actually means</h2>
      <p>
        A readiness score answers a single question: <strong>if a reviewer were to look at this right now, what would they probably say?</strong> The system scores the artifact, surfaces specific suggestions, and offers a one-click path to apply them. The pre-review loop closes faster, and the reviewer sees a cleaner artifact when they finally arrive.
      </p>
      <p>
        Nothing about that loop is specific to pull requests. The artifact changes; the loop is invariant.
      </p>

      <div className="eyebrow">Section 2</div>
      <h2>Where else this can apply</h2>
      <p>
        The same loop fits a wide range of work products. Below is a non-exhaustive list — for each, the format is the same: who does the work, where in their flow the readiness check sits, what the AI surfaces, the metric a manager would actually pull on, and the comparative story that makes adoption legible.
      </p>

      <h3>1. Sales calls</h3>
      <ul>
        <li><strong>Worker</strong> — account executives and relationship managers.</li>
        <li><strong>Workflow</strong> — sales call → AI call review → follow-up → next step booked.</li>
        <li><strong>AI helps with</strong> — missed questions, objection handling, follow-up quality.</li>
        <li><strong>ROI metric</strong> — next-step rate, conversion rate, deal progression.</li>
        <li><strong>Manager pull</strong> — compare teams with higher AI coaching usage against pipeline movement.</li>
      </ul>

      <h3>2. Customer support tickets</h3>
      <ul>
        <li><strong>Worker</strong> — support agents.</li>
        <li><strong>Workflow</strong> — ticket response drafted → AI quality check → customer reply → resolution.</li>
        <li><strong>AI helps with</strong> — tone, completeness, policy accuracy, escalation detection.</li>
        <li><strong>ROI metric</strong> — first-contact resolution, response time, CSAT, escalation rate.</li>
        <li><strong>Manager pull</strong> — show that teams using AI checks resolve faster with fewer escalations.</li>
      </ul>

      <h3>3. Finance reporting packs</h3>
      <ul>
        <li><strong>Worker</strong> — finance analysts.</li>
        <li><strong>Workflow</strong> — monthly report → AI commentary review → manager review → exec pack.</li>
        <li><strong>AI helps with</strong> — variance explanations, unclear commentary, missing drivers.</li>
        <li><strong>ROI metric</strong> — reporting turnaround time, review cycles, corrections needed.</li>
        <li><strong>Manager pull</strong> — compare finance teams on close-and-report cycle time.</li>
      </ul>

      <h3>4. Consulting deliverables</h3>
      <ul>
        <li><strong>Worker</strong> — consultants and associates.</li>
        <li><strong>Workflow</strong> — draft client update → AI readiness review → manager / partner review → client send.</li>
        <li><strong>AI helps with</strong> — clarity, structure, missing evidence, weak recommendations.</li>
        <li><strong>ROI metric</strong> — review cycles, time to client-ready version, partner edits.</li>
        <li><strong>Manager pull</strong> — show that teams using readiness produce client-ready drafts faster.</li>
      </ul>

      <h3>5. RFP and proposal responses</h3>
      <ul>
        <li><strong>Worker</strong> — bid managers, sales engineers, consultants.</li>
        <li><strong>Workflow</strong> — draft response → AI completeness check → review → submission.</li>
        <li><strong>AI helps with</strong> — unanswered requirements, weak proof points, inconsistent language.</li>
        <li><strong>ROI metric</strong> — proposal turnaround time, compliance score, win rate over time.</li>
        <li><strong>Manager pull</strong> — compare adopting teams on submission speed and quality.</li>
      </ul>

      <h3>6. Product specs and tickets</h3>
      <ul>
        <li><strong>Worker</strong> — product managers.</li>
        <li><strong>Workflow</strong> — PRD or ticket draft → AI readiness check → engineering review → build starts.</li>
        <li><strong>AI helps with</strong> — unclear requirements, missing edge cases, weak acceptance criteria.</li>
        <li><strong>ROI metric</strong> — rework, clarification cycles, time from spec to build start.</li>
        <li><strong>Manager pull</strong> — show that AI spec checks reduce engineering back-and-forth.</li>
      </ul>

      <h3>7. Audit workpapers</h3>
      <ul>
        <li><strong>Worker</strong> — audit associates.</li>
        <li><strong>Workflow</strong> — workpaper draft → AI completeness check → senior review → sign-off.</li>
        <li><strong>AI helps with</strong> — missing evidence, unclear rationale, unsupported conclusions.</li>
        <li><strong>ROI metric</strong> — review notes, time to sign-off, rework rate.</li>
        <li><strong>Manager pull</strong> — compare audit teams on review-note volume and sign-off speed.</li>
      </ul>

      <h3>8. Claims review</h3>
      <ul>
        <li><strong>Worker</strong> — claims analysts.</li>
        <li><strong>Workflow</strong> — claim assessment → AI completeness / risk check → approval or escalation.</li>
        <li><strong>AI helps with</strong> — missing documents, inconsistent facts, escalation triggers.</li>
        <li><strong>ROI metric</strong> — claim handling time, rework, escalation accuracy.</li>
        <li><strong>Manager pull</strong> — show that AI checks close claims faster without quality loss.</li>
      </ul>

      <div className="eyebrow">Section 3</div>
      <h2>Across segments</h2>
      <p>
        The engine is industry-agnostic; the readiness rubric is not. The interesting work is in shaping the rubric per segment — and that's exactly what the AI lead at each company is positioned to do.
      </p>
      <ul>
        <li><strong>Finance</strong> — risk language, regulatory citations, audit trails, control attestations.</li>
        <li><strong>Professional services</strong> — scope clarity, deliverable framing, conflict checks, engagement-letter alignment.</li>
        <li><strong>Retail</strong> — vendor terms, margin assumptions, seasonality, inventory exposure.</li>
        <li><strong>Healthcare</strong> — privacy guardrails, evidence grade, payer alignment, clinical-pathway adherence.</li>
      </ul>

      <div className="eyebrow">Section 4</div>
      <h2>What stays the same</h2>
      <p>
        Whatever the artifact and whatever the segment, the motion is the same: <em>produce, score, suggest, accept or fix, ship</em>. The AI lead at each company shapes the rubric and the suggestion bank; chico.ai runs the loop. The screen looks different for a pre-call brief than for a pull request, but the engine underneath does not change.
      </p>
      <p>
        That's the path from a single prototype to a category.
      </p>
    </>
  );
}

const POSTS = {
  presentation: {
    eyebrow: 'Presentation',
    title:   'chico.ai — PR Readiness',
    lead:    'A short walk-through of what this prototype is, the problem it tries to solve, and how the pieces fit together.',
    body:    PostPresentation,
  },
  meta: {
    eyebrow: 'Origin',
    title:   'Meta — the engine, not the app',
    lead:    'Why this prototype was scoped around an engine and an AI lead, instead of a feature for one named persona.',
    body:    PostMeta,
  },
  expanding: {
    eyebrow: 'Roadmap',
    title:   'Expanding — beyond pull requests',
    lead:    'Where the PR Readiness loop goes next: adjacent work products, and how the rubric flexes across industries.',
    body:    PostExpanding,
  },
};

const PageBlog = ({ ctx, slug }) => {
  const post = POSTS[slug] || POSTS.presentation;
  const Body = post.body;

  return (
    <div className="col gap-20" style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 40 }}>

      {/* Header card */}
      <div className="pillow p-32" style={{ maxWidth: 860, width: '100%' }}>
        <div className="row gap-12 wrap mb-12" style={{ alignItems: 'center' }}>
          <span className="pill pill-accent">Blog</span>
          <span className="t-12 text-3 uppercase">{post.eyebrow}</span>
          <span className="t-14 w-600 text-1">Adrien Larere</span>
        </div>
        <div className="t-40 text-1">{post.title}</div>
        <div className="t-16 text-2 mt-12" style={{ maxWidth: 640, lineHeight: 1.6 }}>
          {post.lead}
        </div>
      </div>

      {/* Body card */}
      <div className="pillow" style={{ maxWidth: 860, width: '100%', padding: '48px 64px' }}>
        <div className="prose" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Body />
        </div>
      </div>
    </div>
  );
};

window.PageBlog = PageBlog;
