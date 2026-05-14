// Blog — single-post layout. Post switching happens via the navbar pill (see app.jsx).

// =============== Post content ===============

function PostPresentation({ ctx }) {
  const openExpanding = (e) => {
    e.preventDefault();
    ctx && ctx.goToBlog && ctx.goToBlog('expanding');
  };
  return (
    <>
      <h2>The Problem</h2>
      <p>Chico.ai monitors AI use, but does nothing to improve adoption.</p>
      <p>We want a feature that is
        <ol>
          <li><b>Narrow</b> enough it can be built fast, and quickly validate or dismiss its existence.</li>
          <li><b>Broad</b> enough that if it works, its theory or model is generalizable.</li>
        </ol>
      </p>

      <h2>Tensions and Obstacles</h2>
      <ul>
        <li>
          Multiple stakeholders with different goals. Roughly: CEOs vs Managers vs Workers
          <ul>
            <li>CEOs want to see a return on their investment</li>
            <li>Managers need to be convinced it works because they are afraid of losing time and don't want their teams to feel surveilled</li>
            <li>Workers need to feel comfortable and helped, not forced</li>
          </ul>
        </li>
        <li>A very specific workflow demos well but may not scale. Yet we must solve for a specific role.</li>
        <li>You can design things that people engage with when they are forced to, but then they don't actually use them in real life</li>
        <li>AI usage is easy to measure; ROI can be more nebulous</li>
      </ul>

      <h2>Things I want from my feature</h2>
      <ul>
        <li><b>Integrated</b> into real work/systems/processes</li>
        <li><b>Involving both managers and workers</b>. Managers they need to be convinced to convince their teams; workers because they are probably more closely tied to ROI than the managers.</li>
        <li><b>Suggestive, not prescriptive</b>. Think « you could try this » rather than « you must do this » &rarr; This is crucial in my opinion: showing workers what the AI can do for them and showing them how it helps others, will I think lead to adoption IF the AI does indeed improve the work produced</li>
        <li>Be a sort of <b>loop</b> where the AI adoption is tied into to a real metric</li>
      </ul>

    <h2>Solution</h2>
      <p>I must pick a specific use case. How do I choose?</p>
      <br/>
      <p>Chico customers are mostly in</p>
      <ul>
        <li>Finance</li>
        <li>Professional services</li>
        <li>Retail</li>
        <li>Healthcare</li>
      </ul>
      <br/>
      <p><b>I will build an AI adoption system for software developers</b>.</p>
      <p>Given the industries of our clients, this may appear off-topic.</p>
      <br/>
      <p><b>Here is my reasoning:</b></p>
      <ul>
        <li>Many of our clients have engineering teams. Finance, for example, offers a lot of digital products</li>
        <li>I know firsthand that many developers are <b>not</b> caught up with AI</li>
        <li>Some of our client's engineering teams will therefore be struggling with AI adoption</li>
        <li>The more objective nature of software makes it easier to measure</li>
        <li>This is an area I am extremely familiar with, so I can build something relevant quickly</li>
        <li>As I will detail below, while this feature is targeted at engineering teams, it can be scaled to other roles</li>
      </ul>
      <br/>
      <p>Tech leads / Product Managers are faced with the same problem when it comes to adoption:</p>
      <p>I'm told I need to increase AI use, but how do I do it? How do I convince my team to use AI? Is it even good for our use cases?</p>

      <p>My solution resolves the problems and tensions listed above.</p>

      <h2>Introducing: ChicoAI's PR Readiness.</h2>
      <p><i>PR = Pull Request. The developer is submitting code changes and asking the manager/team "Can you please review my code before adding it to the codebase"</i></p>
      <br/>

      <p>The PR readiness system does a few things:</p>
      <p>At its core, it is a github plugin that enables your company's AI (whatever it is) to suggest PR improvements. In the real product, this would live inside GitHub as a PR check/comment. In the prototype, I'm showing the full flow in a standalone app.</p>
      <p>This is a win for developers because it does not <i>force</i> them to use AI; instead it lets them see how it simplifies their work by reducing PR approval time. Developers can accept an AI suggestion, and if they don't like it, undo it.</p>
      <p>However, it was just that, it would be a lesser Copilot clone.</p>
      <p>On top of the PR improving AI, we also measure two crucial metrics: (1) how much the developers are using the AI suggestions (2) How long until a PR gets approved.</p>
      <p>This enables us to measure correlation.</p>
      <p>Managers can inspect PR-level activity and see team-level patterns.</p>
      <p>Everyone sees the performance and AI use of the other teams.</p>

      <p>This in my opinion gives Chico.ai the perfect balance of:</p>
      <ul>
        <li>A suggestive AI that invites developers to use it without forcing them, letting them get familiar over time</li>
        <li>A monitoring and comparative tool that enables managers to see the impact of AI on ROI, and can see the performance of their team vs others</li>
      </ul>

      <hr />

      <h2>Too narrow?</h2>
      <p>The main counter argument to this feature is that it is not representative of our customers, such that it won't scale.</p>
      <p>Engineering is not the whole market indeed; but it is one of the easiest measurable process to test the correlation between AI adoption and ROI.</p> 
      <p><b>The general pattern is workflow readiness.</b></p>
      <p>
        <a href="/blog/expanding" onClick={openExpanding} className="prose-link">Click here to find out about ways this solution can work for other roles</a>
      </p>

      <hr />

      <h2>Weaknesses/future problems</h2>
      <ul>
        <li>PR base Readiness score is currently arbitrary. A lot of the numbers on the app are made up to bring the feature to life.</li>
        <li>The tool adds an extra step to the workflow that might feel clunky and frustrating to developers. This is a known problem for analytics tools.</li>
        <li>
          PR Approval time might be an untrustworthy metric: maybe you ship code faster, but it is worse. This is a common problem with easy-to-track metrics. Potential solutions include
          <ul>
            <li>Another AI rating the quality of outputted code</li>
            <li>A human + AI review of the outputted code; done using the time saved by the reduced PR approval time.</li>
          </ul>
        </li>
      </ul>

      <hr />

      <h2>How do we scale this in 3/6/12 months? How do we measure success?</h2>
      <ul>
        <li>3 months: pilot with 3 to 5 engineering teams</li>
        <li>6 months: prove adoption and review-cycle improvement</li>
        <li>12 months: expand to more workflows, such as sales calls, support tickets, finance reports</li>
      </ul>
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

      <h2>What "readiness" actually means</h2>
      <p>
        A readiness score answers a single question: <strong>if a reviewer were to look at this right now, what would they probably say?</strong> The system scores the artifact, surfaces specific suggestions, and offers a one-click path to apply them. The pre-review loop closes faster, and the reviewer sees a cleaner artifact when they finally arrive.
      </p>
      <p>
        Nothing about that loop is specific to pull requests. The artifact changes; the loop is invariant.
      </p>

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
    title:   'chico.ai • PR Readiness',
    lead:    'A short walk-through of what this prototype is, the problem it tries to solve, and how the pieces fit together.',
    body:    PostPresentation,
  },
  expanding: {
    eyebrow: 'Roadmap',
    title:   'Expanding • beyond pull requests',
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
      <div className="pillow p-32" style={{ maxWidth: 1032, width: '100%', textAlign: 'center' }}>
        <div className="row gap-12 wrap mb-12" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <span className="pill pill-accent">Blog</span>
          <span className="t-12 text-3 uppercase">{post.eyebrow}</span>
          <span className="t-14 w-600 text-1">Adrien Larere</span>
        </div>
        <div className="t-40 text-1">{post.title}</div>
        <div className="t-16 text-2 mt-12" style={{ maxWidth: 640, lineHeight: 1.6, marginLeft: 'auto', marginRight: 'auto' }}>
          {post.lead}
        </div>
      </div>

      {/* Body card */}
      <div className="pillow" style={{ maxWidth: 1032, width: '100%', padding: '48px 64px' }}>
        <div className="prose" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Body ctx={ctx} />
        </div>
      </div>
    </div>
  );
};

window.PageBlog = PageBlog;
