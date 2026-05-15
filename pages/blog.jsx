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
        <li><b>Involving both managers and workers</b>. Managers because they need to be convinced to convince their teams; workers because they are probably more closely tied to "real metrics" than the managers.</li>
        <li><b>Suggestive, not prescriptive</b>. Think "you could try this" rather than "you must do this"<br/>&rarr; This is crucial in my opinion: showing workers what the AI can do for them and showing them how it helps others, will I think lead to adoption IF the AI does indeed improve the work produced</li>
        <li>Be a sort of <b>loop</b> where the AI adoption is tied to to a real metric</li>
      </ul>

    <h2>Solution</h2>
      <p>I must pick a specific use case. How do I choose?</p>
      <br/>
      <p>Chico customers are mostly in:</p>
      <ul>
        <li>Finance</li>
        <li>Professional services</li>
        <li>Retail</li>
        <li>Healthcare</li>
      </ul>
      <br/>
      <p><b>I will build an AI adoption system for software developers</b>.</p>
      <p><i>Specifically</i>, a A busy technical manager <i>and their team</i> of ~5 developers, working in a company with several other technical teams.</p>
      <br/>
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
      <p>"I'm told I need to increase AI use, but how do I do it? How do I convince my team to use AI? Is it even relevant to our use cases?"</p>

      <br/>
      <p>My solution resolves the problems and tensions listed above.</p>

      <h2>Introducing: ChicoAI's PR Readiness.</h2>
      <p><i>PR = Pull Request. The developer is submitting code changes and asking the manager/team "Can you please review my code before adding it to the codebase"</i></p>
      <br/>

      <p>The PR readiness system does a few things:</p>
      <p>At its core, it is a github plugin that enables your company's AI (whatever it is) to suggest PR improvements. In the real product, this would live partly inside GitHub as a PR check/comment. In the prototype, I'm showing the full flow in a standalone app.</p>
      <p>This is a win for developers because it does not <i>force</i> them to use AI; instead it lets them see how it simplifies their work by reducing PR approval time. Developers can accept an AI suggestion, and if they don't like it, undo it.</p>
      <p>However, it was just that, it would be a lesser Copilot clone.</p>
      <p>On top of the PR improving AI, we also measure two crucial metrics: (1) how much the developers are using the AI suggestions (2) How long until a PR gets approved.</p>
      <p>This enables us to measure correlation.</p>
      <p>Managers can inspect PR-level activity and see team-level patterns.</p>
      <p>Everyone sees the performance and AI use of the other teams.</p>
      <br/>
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
      <br/>
      <p>
        <a href="/blog/expanding" onClick={openExpanding} className="prose-link">Click here to find out about ways this solution can work for other roles</a>
      </p>

      <hr />

      <h2>Weaknesses/future problems</h2>
      <ul>
        <li>PR base Readiness score is currently arbitrary. A lot of the numbers on the app are made up to bring the feature to life.</li>
        <li>The tool adds an extra step to the workflow that might feel clunky and frustrating to developers. This is a known problem for analytics tools.</li>
        <li>
          PR Approval time might be an untrustworthy metric: maybe you ship code faster, but it is worse. This is a common problem with easy-to-track metrics. <br/>I also make the assumption that code quality is the bottleneck for PR approval; it might not. Managers could be busy, understaffed, approving everything after X hours regardless of the code...<br/> Potential solutions include:
          <ul>
            <li>Another AI rating the quality of outputted code</li>
            <li>A human + AI review of the outputted code; done using the time saved by the reduced PR approval time.</li>
            <li>Supporting metrics:
              <ul>
                <li>Time from first review to approval: Once a human has looked at the PR, how much back-and-forth remains?<br/>This gets rid of the time between submission and review, which is not changed by AI use.</li>
                <li>Number of requested changes: Track how often reviewers request changes, and how many changes are requested.</li>
              </ul>
            </li>
            <li>Guardrail metrics:
              <ul>
                <li>No increase in bugs in the code (needs a baseline to make sense)</li>
                <li>No increase in customer tickets/complains</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <hr />

      <h2>How do we scale this in 3/6/12 months? How do we measure success?</h2>
      <p>Our users will use Claude Code, Codex, or Gemini Code Assist. Our job is to make them stick. For engineering, that means adding a readiness layer around the coding workflow. If a developer uses Claude Code, Chico can run in the terminal before the PR. If they use Codex, Chico can run as a CLI workflow or evaluate the PR Codex creates. If they use Gemini, Chico can start in GitHub and later move into the IDE. The common layer is GitHub: every code path eventually becomes a PR, and that is where Chico can measure whether AI-assisted work is actually producing faster, cleaner reviews.</p>
      <ul>
        <li>3 months: proof that Readiness works for PRs. Various teams over various companies use the PR readiness product. We iterate, improve, and start building versions for other review-heavy workflows.</li>
        <li>6 months: proof that the Readiness pattern works in other review-heavy workflows like sales calls and claims. We iterate, improve, and start building the product for different roles and workflows.</li>
        <li>12 months: Chico should become the layer that helps enterprises turn AI from generic licences into role-specific workflows, then measure whether those workflows actually change business outcomes.</li>
      </ul>
      <br/>
      <p>
        <a href="/blog/expanding" onClick={openExpanding} className="prose-link">The scale programme</a>
      </p>
    </>
  );
}

function PostExpanding() {
  return (
    <>
      <p className="lead">
        PR Readiness is the first version of a bigger idea: help people check the quality of their work before someone else has to review it. The product is not really about pull requests. It is about the moment before review, when a small fix can save a lot of back-and-forth.
      </p>
      <hr />

      <h2>What "readiness" actually means</h2>
      <p>
        A readiness check answers a simple question: <strong>if the next person in the workflow looked at this now, what would they probably push back on?</strong> The system looks at the work, compares it against the team&apos;s standards, surfaces the likely issues, and helps the user fix them before they send it on.
      </p>
      <p>
        That loop is not specific to engineering. The artifact changes, but the pattern to fix stays the same: someone produces work, someone else reviews it, and review cycles slow the business down.
      </p>

      <h2>The first 3 months: prove it inside GitHub</h2>
      <p>
        If this shipped tomorrow, I would not spend three months validating it in a separate dashboard. I would get a basic GitHub integration live quickly and test it with real engineering teams. The product needs to appear where developers already are: inside the pull request, before review starts.
      </p>
      <p>
        To be precise, I would not assume we can redesign GitHub&apos;s native PR flow. The realistic first version is a GitHub App or check that runs when a PR is opened or updated, then posts the readiness result back into the PR. That is still enough to test the product properly, because the feedback appears in the place where the developer and reviewer are already working.
      </p>
      <p>
        The first version would check a PR against a simple readiness rubric: is the description clear, are the risky files explained, are tests mentioned, are edge cases covered, and are there obvious review blockers? The goal is not to replace the reviewer. The goal is to remove the comments that should never have needed a human reviewer in the first place.
      </p>
      <p>
        For the first 3 months, I would measure whether PRs using Readiness move faster and create fewer avoidable review loops. The key metrics would be time from PR open to merge, number of review rounds, number of basic clarification comments, and developer sentiment. If the trend is weak, we change the rubric, the timing, or the UX. If the trend is positive, we do not over-polish the engineering use case. We take the learning and expand.
      </p>

      <h2>The next 3 months: turn Readiness into a vertical</h2>
      <p>
        Once we have evidence that the loop works in engineering, the next step is to test whether the same product shape works in other teams. I would pick workflows that have the same structure as PR review: a person creates something, a reviewer checks it, and quality problems create expensive back-and-forth.
      </p>

      <h3>1. Sales call readiness</h3>
      <p>
        This would be for account executives and relationship managers who need to turn customer conversations into strong follow-ups. After a call, the product would review the transcript and ask: did we capture the customer&apos;s pain, did we handle objections, did we agree a clear next step, and is the follow-up email strong enough to move the deal forward?
      </p>
      <ul>
        <li><strong>Where it sits</strong> — after a sales call, before the rep sends the follow-up.</li>
        <li><strong>What it improves</strong> — missed objections, vague next steps, weak follow-up emails, and inconsistent sales coaching.</li>
        <li><strong>How we measure it</strong> — next-step booked rate, follow-up quality, deal progression, and conversion over time.</li>
      </ul>

      <h3>2. Claims readiness</h3>
      <p>
        This would be for insurance claims analysts who need to decide whether a claim is ready to approve, reject, or escalate. Before the analyst moves the claim forward, the product would check whether key evidence is missing, whether the facts are consistent, and whether the claim matches known escalation rules.
      </p>
      <ul>
        <li><strong>Where it sits</strong> — after the analyst drafts their assessment, before approval or escalation.</li>
        <li><strong>What it improves</strong> — missing documents, inconsistent reasoning, incorrect escalations, and rework from senior reviewers.</li>
        <li><strong>How we measure it</strong> — claim handling time, rework rate, escalation accuracy, and quality audit outcomes.</li>
      </ul>

      <h3>3. Customer support readiness</h3>
      <p>
        This would be for support agents who need to send accurate, helpful replies under time pressure. Before a response goes to the customer, the product would check whether the answer is complete, whether the tone is right, whether policy has been followed, and whether the ticket should be escalated instead.
      </p>
      <ul>
        <li><strong>Where it sits</strong> — after the agent drafts a response, before it is sent to the customer.</li>
        <li><strong>What it improves</strong> — incomplete replies, poor tone, policy mistakes, missed escalation signals, and repeat contacts.</li>
        <li><strong>How we measure it</strong> — first-contact resolution, response time, CSAT, escalation rate, and reopen rate.</li>
      </ul>

      <h2>After 6 months: expand to roles where this flow naturally fits</h2>
      <p>
        By this point, the product should not just be a PR tool with a few copies. It should become a repeatable adoption pattern for knowledge work. The right expansion areas are roles where work is reviewed often, quality standards are knowable, and the business already feels the cost of rework.
      </p>

      <h3>4. Finance report readiness</h3>
      <p>
        Finance analysts spend a lot of time preparing monthly reporting packs for managers and executives. A readiness check could review the commentary before it reaches the finance manager: are the variances explained clearly, are the drivers named, are the numbers consistent with the narrative, and are obvious executive questions answered?
      </p>
      <ul>
        <li><strong>Where it sits</strong> — before a monthly report or board pack goes to review.</li>
        <li><strong>What it improves</strong> — unclear commentary, missing business drivers, inconsistent numbers, and repeated manager edits.</li>
        <li><strong>How we measure it</strong> — reporting turnaround time, number of review cycles, corrections needed, and time saved during close.</li>
      </ul>

      <h3>5. Consulting deliverable readiness</h3>
      <p>
        Consultants and associates often prepare client updates, analysis packs, or recommendations that need manager or partner review before they go to the client. A readiness check could flag weak recommendations, missing evidence, unclear structure, and places where the client&apos;s actual question has not been answered.
      </p>
      <ul>
        <li><strong>Where it sits</strong> — before a draft client deliverable goes to a manager or partner.</li>
        <li><strong>What it improves</strong> — vague recommendations, weak evidence, poor structure, and partner review time.</li>
        <li><strong>How we measure it</strong> — time to client-ready version, number of review rounds, partner edits, and delivery speed.</li>
      </ul>

      <h3>6. RFP and proposal readiness</h3>
      <p>
        Bid teams, sales engineers, and consultants spend hours preparing proposal responses. A readiness check could review the draft before submission and ask whether every requirement has been answered, whether the proof points are strong enough, and whether the response sounds consistent across sections.
      </p>
      <ul>
        <li><strong>Where it sits</strong> — after a proposal draft is assembled, before final review and submission.</li>
        <li><strong>What it improves</strong> — unanswered requirements, inconsistent language, weak proof points, and slow proposal review.</li>
        <li><strong>How we measure it</strong> — proposal turnaround time, compliance score, review effort, and eventually win rate.</li>
      </ul>

      <h3>7. Product spec readiness</h3>
      <p>
        Product managers write specs and tickets that engineers then have to interpret. A readiness check could review a PRD or ticket before engineering review and flag unclear requirements, missing edge cases, weak acceptance criteria, or decisions that still need to be made.
      </p>
      <ul>
        <li><strong>Where it sits</strong> — before a product spec or ticket goes to engineering.</li>
        <li><strong>What it improves</strong> — unclear requirements, missing edge cases, repeated clarification, and delayed build starts.</li>
        <li><strong>How we measure it</strong> — clarification cycles, rework, time from spec to build start, and engineering satisfaction.</li>
      </ul>

      <h3>8. Audit workpaper readiness</h3>
      <p>
        Audit associates prepare workpapers that seniors and managers review before sign-off. A readiness check could flag missing evidence, unsupported conclusions, unclear rationale, or places where the workpaper does not match the audit program.
      </p>
      <ul>
        <li><strong>Where it sits</strong> — before a workpaper is submitted to the senior reviewer.</li>
        <li><strong>What it improves</strong> — review notes, missing evidence, unsupported conclusions, and rework before sign-off.</li>
        <li><strong>How we measure it</strong> — review-note volume, time to sign-off, rework rate, and audit quality findings.</li>
      </ul>

      <h2>After 12 months: move beyond Readiness</h2>
      <p>
        At 12 months, I would not want Chico to be boxed in as a readiness product. Readiness is the wedge because it gives us a clean first motion: check the work before review. But the bigger category is AI adoption tools for specific roles and workflows.
      </p>
      <p>
        The question becomes: for each role inside a client company, where can AI make a recurring workflow faster, better, or cheaper? Sometimes the answer will be a readiness check. Sometimes it will be a summary, a draft, a triage tool, a recommendation, a coach, a search layer, or a decision-support tool.
      </p>

      <h3>How I would define the next opportunities</h3>
      <p>
        I would use a simple filter. First, find workflows that happen every week. Second, find the painful part of that workflow: time lost, quality variance, missed follow-up, compliance risk, or manager review burden. Third, decide what kind of AI help fits that moment. Fourth, measure adoption inside the workflow, not through generic AI usage. Fifth, connect the workflow metric to ROI.
      </p>
      <p>
        That is the shift: Chico stops asking “are employees using AI?” and starts asking “which role-level workflows are improving because AI is embedded inside them?”
      </p>

      <h3>Examples in financial services</h3>
      <p>
        A relationship manager could use AI to prepare for client meetings by pulling together CRM notes, recent emails, portfolio changes, and market context. Adoption would be measured by how often meeting briefs are generated and used before client calls. ROI would be measured through prep time saved, follow-up completion, client engagement, and pipeline movement.
      </p>
      <p>
        A compliance analyst could use AI to triage policy exceptions, summarise the relevant rules, and suggest the likely next step. Adoption would be measured by the percentage of cases where AI triage is used. ROI would be measured through faster case handling, better escalation accuracy, and reduced manual review effort.
      </p>

      <h3>Examples in retail</h3>
      <p>
        A merchandiser could use AI to analyse product performance, stock levels, seasonality, and margin pressure, then suggest actions for the next buying or replenishment decision. Adoption would be measured by how often planners use AI recommendations before decisions. ROI would be measured through fewer stockouts, lower markdowns, and better margin.
      </p>
      <p>
        A store manager could use AI to turn daily sales, staffing, inventory, and customer feedback into a practical action plan for the day. Adoption would be measured by daily plan usage and task completion. ROI would be measured through labour efficiency, sales uplift, shrink reduction, and fewer missed operational issues.
      </p>

      <h3>Examples in healthcare</h3>
      <p>
        A care coordinator could use AI to summarise patient history, open referrals, outstanding tasks, and next actions before a follow-up. Adoption would be measured by how often coordinators use the summary before working a case. ROI would be measured through time saved per case, fewer missed follow-ups, and faster coordination.
      </p>
      <p>
        A revenue cycle team could use AI to classify denied claims, suggest appeal reasons, and prioritise the highest-value recoveries. Adoption would be measured by the percentage of denials handled through the AI-assisted workflow. ROI would be measured through appeal turnaround time, denial recovery rate, and recovered revenue.
      </p>

      <h3>Examples in professional services</h3>
      <p>
        A consultant could use AI to turn research, interview notes, and client context into a first draft of a client deliverable. Adoption would be measured by how often teams use AI to create first drafts or structured outlines. ROI would be measured through time to first draft, review cycles, project margin, and speed to client-ready output.
      </p>
      <p>
        An engagement manager could use AI to monitor project health by summarising meeting notes, risks, blockers, scope changes, and next steps across the project. Adoption would be measured by weekly use of AI-generated project health summaries. ROI would be measured through fewer missed risks, reduced project slippage, and better team utilisation.
      </p>

      <h2>What changes by industry</h2>
      <p>
        The engine can stay the same, but the rubric cannot. A readiness product only works if it understands what “good” means in that company&apos;s context. That is where Chico&apos;s role-level adoption thesis becomes important.
      </p>
      <ul>
        <li><strong>In financial services</strong>, readiness might mean checking risk language, regulatory references, audit trails, and approval controls.</li>
        <li><strong>In professional services</strong>, readiness might mean checking client framing, evidence quality, scope alignment, and whether the recommendation is strong enough.</li>
        <li><strong>In retail</strong>, readiness might mean checking margin assumptions, vendor terms, seasonality, inventory risk, and whether the commercial logic is clear.</li>
        <li><strong>In healthcare</strong>, readiness might mean checking privacy guardrails, evidence quality, payer requirements, and whether the work follows the right clinical or operational pathway.</li>
      </ul>

      <h2>What stays the same</h2>
      <p>
        In the first phase, the product motion stays simple: create the work, run the readiness check, fix the obvious gaps, and send a cleaner version to the reviewer. The user gets faster feedback. The reviewer gets better work. The manager gets a measurable story about quality and speed.
      </p>
      <p>
        In the second phase, the pattern gets broader. Chico becomes the layer that helps companies find the right AI workflow for each role, launch it where the work already happens, and measure whether it actually improves the business.
      </p>
      <p>
        That is how this scales from one GitHub prototype into something larger. PR Readiness is the wedge. Role-level AI adoption is the product bet.
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
      <div className="pillow p-32" style={{ maxWidth: 1032, width: '100%', textAlign: 'center', position: 'relative' }}>
        <div className="blog-side-icon blog-side-icon-left" aria-hidden="true">
          <img src="assets/chico-bear.png" alt="" />
        </div>
        <div className="blog-side-icon blog-side-icon-right" aria-hidden="true">
          <img src="assets/chico-bear.png" alt="" />
        </div>
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
