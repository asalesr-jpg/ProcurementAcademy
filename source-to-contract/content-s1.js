window.COURSE = window.COURSE || { sessions: [] };
window.COURSE.sessions.push({
  id: "s1", num: 1,
  title: "WHAT are we sourcing?",
  theme: "From request to category insight",
  question: "What do we really need, what does the market look like, and who holds the power?",
  output: "Sourcing Case part 1: validated need, category profile and power position for your project",
  objectives: [
    "Explain why Source to Contract is a decision chain, and place any sourcing event on the 11 steps.",
    "Run a structured intake: validate the need, check existing contracts and Group frameworks, estimate value and term, and triage the regulatory questions early.",
    "Build a category fact base: spend cube, contract inventory, demand drivers and a total cost of ownership baseline.",
    "Analyse a supply market and judge how attractive our account is to the incumbent (supplier preferencing).",
    "Position a project on the Kraljic matrix and the Purchasing Chessboard and name its strategic direction."
  ],
  prework: {
    minutes: 45,
    items: [
      { id: "s1-pw-read", title: "A decision chain, not a document chain", minutes: 12, body: `
<p class="lead">Most sourcing events in indirect Procurement are judged by their documents: was there an RFQ, were there three quotes, is the contract signed? Those are the visible steps. The value is decided by the invisible ones.</p>
<p>Before any request goes to suppliers, someone decides, explicitly or by default, what is really needed, how much of it, whether an existing contract could cover it, which suppliers can deliver it, and how much power each side holds. Those answers decide the sourcing strategy: one supplier by tender, a panel of preferred suppliers, a negotiation with an incumbent, or an e-auction. Only then does it make sense to choose the tool.</p>
<div class="callout"><strong>The rule of this course.</strong> Analyse the category and the power position first. Choose the strategy second. Pick the tool (RFI, RFP, RFQ, e-auction, mini-competition, negotiation) last. The tool follows the strategy, never the reverse.</div>
<p>Kraljic made the same point in 1983 in the <em>Harvard Business Review</em>: purchasing had become attached to routine, yearly negotiations with established suppliers, at a time when supply could be "upset virtually overnight". His answer was to classify purchases by profit impact and supply risk before deciding how to buy them. Forty years later the Kearney Purchasing Chessboard and Jonathan O'Brien's category management process still start in the same place: insight before strategy.</p>
<p>Our fictional insurer, Nordvia, shows the cost of skipping it. Its Procurement team of 9 runs about 60 sourcing events a year in Coupa. Until now most were RFQs with three quotes, whatever the category: the same tool for office cleaning, IT consulting and a core software renewal. In this course we will see why each of those needs a different route.</p>` },
      { id: "s1-pw-case", title: "Choose your Sourcing Case project", minutes: 18, body: `
<p>Throughout the course you build the S2C file of <strong>one real project</strong> from your own pipeline: your Sourcing Case. You present it to a panel at the capstone, about four weeks after Session 4.</p>
<h4>A good Sourcing Case project</h4>
<ul>
<li>Goes to market, or renews, in the next 6 to 18 months, so the work is real and still open.</li>
<li>Is big enough to matter: as a guide, above €250K over the contract term.</li>
<li>Has a business owner who will give you an hour between sessions.</li>
<li>Is not already decided: if the supplier and the price are fixed, choose another one.</li>
</ul>
<p>Expiring contracts are the easiest source: in a mature function they make up most of the sourcing pipeline. A new need from a business area works too.</p>
<p>Write down: the project name, the business owner, the current supplier(s) if any, the approximate annual spend and the contract end date. You will enter them in Practice 1.2.</p>` },
      { id: "s1-pw-data", title: "Pull the data you already have", minutes: 15, body: `
<p>Before the session, open Coupa and collect what is already there for your project:</p>
<ul>
<li>24 months of spend (invoices or purchase orders) by supplier.</li>
<li>The current contract(s): start and end dates, notice period, auto-renewal clause, price and indexation terms.</li>
<li>Any Group framework or other entity contract for the same category.</li>
<li>The last sourcing event for this category, if there was one: which tool, how many bidders, what result.</li>
</ul>
<p class="muted small">Gaps are fine. Every missing item becomes a question for Fieldwork 1.</p>` }
    ],
    quiz: [
      { q: "In this course, what should be decided before choosing between an RFP, an RFQ or an e-auction?", options: ["The supplier long list", "The sourcing strategy, based on category and market analysis", "The evaluation weights", "The contract template"], answer: 1, why: "The tool follows the strategy. The strategy rests on the category profile and the power position." },
      { q: "In Kraljic's matrix, a purchase with high profit impact and low supply risk is…", options: ["Strategic", "Bottleneck", "Leverage", "Non-critical"], answer: 2, why: "High impact and many alternatives: use buying power and competition." },
      { q: "In Steele & Court's supplier preferencing model, an account with high value to the supplier but low attractiveness is…", options: ["Core", "Development", "Nuisance", "Exploitable"], answer: 3, why: "The supplier wants the revenue but has little reason to invest in the relationship: expect firm prices and uplifts." },
      { q: "Which Purchasing Chessboard strategy fits high supply power and low demand power?", options: ["Manage spend", "Leverage competition among suppliers", "Seek joint advantage with supplier", "Change the nature of demand"], answer: 3, why: "When the supplier holds the power, the buyer changes what is bought: re-specification, innovation, risk management." },
      { q: "In Ellram's TCO framework, where do switching and exit costs sit?", options: ["Pre-transaction", "Transaction", "Post-transaction", "Outside TCO"], answer: 2, why: "They arise after the purchase. Mobilisation of a new supplier is usually counted as pre-transaction." },
      { q: "When should an insurer ask whether a service is outsourcing of a critical or important function, or an ICT service under DORA?", options: ["At contract signature", "During evaluation", "At intake, before going to market", "Only if the supervisor asks"], answer: 2, why: "The answer changes the governance path, the due diligence, the contract clauses and the lead time, so it must be known at the start." }
    ]
  },
  agenda: [
    ["0:00", "Welcome, course map, check-in poll", "Plenary"],
    ["0:20", "1.1 S2C as a decision chain", "Input and individual mapping"],
    ["0:55", "1.2 Start right: intake and need validation", "Input, Nordvia triage, own intake"],
    ["1:30", "Break", ""],
    ["1:40", "1.3 Know the category: spend, contracts, TCO", "Input and own fact base"],
    ["2:15", "1.4 Know the market and how it sees us", "Input, pairs, own market snapshot"],
    ["2:50", "Break", ""],
    ["3:00", "1.5 Power decides strategy", "Input and own positioning"],
    ["3:30", "Case 1: positioning the Nordvia pipeline; fieldwork briefing", "Breakout trios, then plenary"],
    ["4:00", "Close", ""]
  ],
  modules: [
    {
      id: "1.1", title: "S2C as a decision chain", minutes: 35,
      lesson: `
<p class="lead">Source to Contract (S2C) covers everything from the first expression of a need to a signed contract that the business can use. Procure to Pay (P2P) starts where S2C ends: requisition, order, receipt, invoice, payment. Value is decided in S2C, and most of it in the first steps.</p>
<h4>How the reference authors frame it</h4>
<table class="tbl">
<thead><tr><th>Author</th><th>Model</th><th>The point for us</th></tr></thead>
<tbody>
<tr><td><strong>CIPS</strong></td><td>Procurement and Supply Cycle, 13 stages from Specification to Asset management</td><td>Stages 1 to 9 are S2C. At the Strategy stage CIPS chooses between competitive tendering and other approaches "based on supply position".</td></tr>
<tr><td><strong>van Weele</strong></td><td>Tactical purchasing (specify, select, contract) before operational purchasing (order, expedite, evaluate)</td><td>Early decisions, above all the specification, lock in most of the cost and risk. Mistakes upstream cannot be repaired downstream.</td></tr>
<tr><td><strong>O'Brien</strong></td><td>Category management in 5 stages ("5i"): Initiation, Insight, Innovation, Implementation, Improvement</td><td>The sourcing strategy is the output of Innovation, and Innovation only starts after Insight: data, market, stakeholders, power.</td></tr>
<tr><td><strong>Monczka et al.</strong></td><td>Strategic sourcing as an iterative process: plan, profile spend, assess the market, develop strategy, execute, transition, measure</td><td>Portfolio segmentation drives the sourcing approach; one approach for all is the failure mode.</td></tr>
</tbody></table>
<h4>The 11 steps we use in this course</h4>
<table class="tbl">
<thead><tr><th>#</th><th>Step</th><th>Key decision</th><th>Coupa touchpoint</th><th>Session</th></tr></thead>
<tbody>
<tr><td>1</td><td>Demand identification and need validation</td><td>Is the need real? Existing contract? Regulatory triage</td><td>Intake / sourcing request</td><td>1</td></tr>
<tr><td>2</td><td>Category and spend analysis</td><td>Category boundaries; bundle across areas or entities?</td><td>Spend analytics, contract repository</td><td>1</td></tr>
<tr><td>3</td><td>Supply market analysis</td><td>How much supply power? How attractive are we?</td><td>RFI event</td><td>1</td></tr>
<tr><td>4</td><td>Portfolio positioning</td><td>Kraljic, preferencing, Chessboard: the direction</td><td>Category strategy</td><td>1</td></tr>
<tr><td>5</td><td>Sourcing strategy choice</td><td>Number of suppliers, relationship, contract architecture, commercial model, mechanism, term</td><td>Strategy paper attached to the project</td><td>2</td></tr>
<tr><td>6</td><td>RFx design</td><td>Specification, lots, pricing schedule, weights fixed before issue</td><td>Event template, forms, lots</td><td>3</td></tr>
<tr><td>7</td><td>Supplier engagement and bid management</td><td>Equal treatment, Q&amp;A</td><td>Supplier Portal, Message Center</td><td>3</td></tr>
<tr><td>8</td><td>Evaluation</td><td>Shortlist, abnormally low bids, due diligence</td><td>Scoring, SIM questionnaires</td><td>3</td></tr>
<tr><td>9</td><td>Negotiation</td><td>BATNA, targets, rounds, BAFO or auction</td><td>Auction phase, follow-on events</td><td>4</td></tr>
<tr><td>10</td><td>Award and contracting</td><td>Approval, clauses, registers</td><td>CLM, clause library</td><td>4</td></tr>
<tr><td>11</td><td>Handover to P2P and SRM</td><td>Make the contract usable and used</td><td>Catalogue, contract-backed buying</td><td>4</td></tr>
</tbody></table>
<div class="callout"><strong>Decision chain, not document chain.</strong> Steps 1 to 5 produce almost no documents a supplier sees, so they are the ones that get skipped under time pressure. Nordvia's team runs about 60 events a year, mostly RFQs with three quotes: steps 6 to 10 every time, steps 1 to 5 rarely. The result is the same tool for a cleaning contract, an IT consulting spend and a sole-source software renewal.</div>
<h4>What good looks like</h4>
<p>The Hackett Group's 2024 benchmark associates its "Digital World Class" procurement organisations with 23% shorter sourcing cycle times, twice the spend-cost-reduction savings, 59% less maverick buying and 3.7 times fewer suppliers per $1bn of spend than peers. These are consultancy benchmark findings, not peer-reviewed results: use them as a direction, not a target. The faster cycle is not achieved by skipping analysis; it comes from knowing the category before the request arrives.</p>
<p class="muted small">Our Group context (anonymised): about 2% of addressable spend is covered by a Group contract today, and about 800 supplier relationships above €50K carry about 88% of the spend. That is the universe where a decision chain pays back.</p>`,
      exercise: {
        id: "s1-ex1", title: "Practice 1.1: how did your last three sourcing events really run?", minutes: 20,
        brief: "Think of the last three sourcing events you ran or took part in. For each of the 11 steps, mark whether it was done properly, rushed or skipped. Be honest: nobody else sees this unless you share it.",
        fields: [
          { key: "events", type: "pairs", label: "The three events", items: ["Event 1 (category, year)", "Event 2 (category, year)", "Event 3 (category, year)"] },
          { key: "steps", type: "rows", label: "The 11 steps", minRows: 11,
            preset: ["1 Need validation", "2 Category and spend analysis", "3 Supply market analysis", "4 Portfolio positioning", "5 Sourcing strategy choice", "6 RFx design", "7 Supplier engagement", "8 Evaluation", "9 Negotiation", "10 Award and contracting", "11 Handover to P2P and SRM"],
            columns: [
              { key: "step", label: "Step", type: "text" },
              { key: "e1", label: "Event 1", type: "select", options: ["Done", "Rushed", "Skipped", "Not applicable"] },
              { key: "e2", label: "Event 2", type: "select", options: ["Done", "Rushed", "Skipped", "Not applicable"] },
              { key: "e3", label: "Event 3", type: "select", options: ["Done", "Rushed", "Skipped", "Not applicable"] }
            ] },
          { key: "pattern", type: "textarea", label: "Which step do you skip or rush most often, and what did it cost (price, risk, time, relationship)?" },
          { key: "tool", type: "textarea", label: "In which of the three events was the tool chosen before the strategy? What would a better route have been?" }
        ]
      }
    },
    {
      id: "1.2", title: "Start right: intake and need validation", minutes: 35,
      lesson: `
<p class="lead">The cheapest saving is the purchase that does not happen, and the cheapest risk control is the one applied before the market is approached. Intake is where both are decided.</p>
<h4>Six intake questions</h4>
<table class="tbl">
<thead><tr><th>Question</th><th>Why it matters</th><th>Nordvia example (fictional)</th></tr></thead>
<tbody>
<tr><td><strong>1. Is the need real, and how much of it?</strong></td><td>The Chessboard's demand management lever: challenge volume, frequency and specification before buying.</td><td>Two market research tracking studies measure almost the same thing.</td></tr>
<tr><td><strong>2. Does a contract or Group framework already cover it?</strong></td><td>Stops duplicate sourcing and uses bundled Group volume.</td><td>Devices and end-user support bought locally while a Group framework exists at lower rates.</td></tr>
<tr><td><strong>3. Buy, make or keep in-house?</strong></td><td>Decides whether a sourcing event is needed at all, and whether it is outsourcing.</td><td>Claims document scanning: in-house team or BPO provider?</td></tr>
<tr><td><strong>4. What is the value and the term?</strong></td><td>Total contract value (annual value × base term plus options) sets approval levels and the effort the project deserves.</td><td>Cleaning: €2.4M a year × (3 + 1 + 1 years) ≈ €12M total value, not €2.4M.</td></tr>
<tr><td><strong>5. What does the regulatory triage say?</strong></td><td>Changes the governance path, the due diligence, the contract clauses and the lead time.</td><td>Claims IT managed service: critical function, DORA register.</td></tr>
<tr><td><strong>6. Who owns it, and by when?</strong></td><td>A named business owner and a realistic date, counted back from the contract end and notice period.</td><td>Telmo network contract: rolled over twice because nobody owned the renewal.</td></tr>
</tbody></table>
<h4>The regulatory triage: four questions for an insurer</h4>
<table class="tbl">
<thead><tr><th>Question</th><th>Reference</th><th>If yes</th></tr></thead>
<tbody>
<tr><td>Is this outsourcing of a <strong>critical or important function</strong>?</td><td>Solvency II Art. 49; Delegated Regulation 2015/35 Art. 274</td><td>Written outsourcing policy applies; detailed provider examination; written agreement with access, audit and termination rights; prior notification of the supervisor.</td></tr>
<tr><td>Is it an <strong>ICT service</strong>, and does it support a critical or important function?</td><td>DORA (Regulation (EU) 2022/2554) Art. 28 and 30</td><td>Pre-contract assessment (Art. 28(4)) including concentration risk and due diligence; entry in the register of information; Art. 30 clauses; for critical or important functions, a tested exit strategy.</td></tr>
<tr><td>Will the supplier process <strong>personal data</strong>?</td><td>GDPR</td><td>Data processing agreement, security annex, data location and transfer checks.</td></tr>
<tr><td>Could it involve a <strong>staff transfer</strong> or agency work?</td><td>Acquired Rights Directive 2001/23/EC and national law; national agency-work rules</td><td>Staff data in the tender pack, longer mobilisation, a realistic view of the savings; careful SOW design for staff augmentation.</td></tr>
</tbody></table>
<p>Most indirect categories (cleaning, marketing agencies, print, travel) are usually <em>not</em> outsourcing of a critical function. IT services, data storage, cloud, policy administration software support and some BPO may be. The determination is the insurer's own documented assessment: Procurement does not decide it alone, but it must ask the question on day one. EIOPA's Q&amp;A 1283 adds that a one-off expert appointment may not necessarily amount to outsourcing; the more substantial or frequent the service, the more likely it is.</p>
<div class="callout"><strong>Do not cite the EIOPA cloud guidelines as current.</strong> EIOPA withdrew its Guidelines on outsourcing to cloud service providers with effect from 17 January 2025, to avoid overlap with DORA. For ICT, the reference is DORA, together with the Solvency II outsourcing rules where the arrangement is also outsourcing of a critical or important function.</div>
<h4>The sourcing request in Coupa</h4>
<p>Good practice is to build the triage into the intake form itself: a short set of classification questions (outsourcing, ICT, critical function, personal data, staff) that route the request to Risk, Compliance or Information Security automatically, and the same questions reused in Supplier Information Management onboarding. Which intake form and routing your entity uses is a configuration choice: check in your Coupa tenant.</p>`,
      exercise: {
        id: "s1-ex2", title: "Practice 1.2: intake and triage for your Sourcing Case", minutes: 20,
        brief: "Complete the intake for the project you chose in the pre-work. Mark what you do not know yet: those gaps become fieldwork questions for the business owner.",
        fields: [
          { key: "project", type: "text", label: "Project name" },
          { key: "owner", type: "text", label: "Business owner (name, role)" },
          { key: "trigger", type: "select", label: "What triggered it?", options: ["Expiring contract", "New business need", "Proactive initiative (consolidation, panel, Group bundling)", "Urgent and unplanned"] },
          { key: "need", type: "textarea", label: "The need in one or two sentences, in business terms (what outcome, not which supplier)" },
          { key: "challenge", type: "textarea", label: "Demand challenge: could volume, frequency or specification be reduced or simplified?" },
          { key: "existing", type: "select", label: "Existing contract or Group framework that could cover it?", options: ["No, checked", "Yes, it can be used", "Yes, but it does not fit (explain below)", "Not checked yet"] },
          { key: "value", type: "pairs", label: "Value and timing", items: ["Annual value (€)", "Base term + options (years)", "Total contract value (€)", "Current contract end date", "Notice period / auto-renewal", "Latest date to start the sourcing"] },
          { key: "triage", type: "checks", label: "Regulatory triage: tick every question that is a yes or a possible yes", items: ["Outsourcing of a critical or important function (Solvency II)", "ICT service under DORA", "ICT service supporting a critical or important function", "Personal data processed by the supplier", "Possible staff transfer on change of supplier", "Staff augmentation or agency work", "Information security assessment needed"] },
          { key: "gaps", type: "textarea", label: "What you do not know yet, and who can tell you" }
        ]
      }
    },
    {
      id: "1.3", title: "Know the category: spend, contracts, stakeholders, TCO", minutes: 35,
      lesson: `
<p class="lead">O'Brien calls this stage Insight: before anyone proposes a strategy, the team must know what is bought, from whom, at what price, under which contracts and why. The fact base has four parts.</p>
<h4>1. The spend cube</h4>
<p>Spend viewed on three axes: <strong>what</strong> (category and sub-category), <strong>from whom</strong> (supplier, grouped by parent) and <strong>who buys</strong> (business area, site, entity), over at least 24 months. The cube answers the questions that set the strategy: how concentrated is the spend, how many suppliers share it, which areas buy the same thing separately?</p>
<p>Our Group data shows why the "who buys" axis matters: about 90 supplier groups work for two or more entities, with around €50M managed in some 360 separate local relationships. Bundling that demand is the Chessboard's volume bundling and co-sourcing levers in action.</p>
<h4>2. The contract inventory</h4>
<p>For every contract: value, start and end date, notice period, auto-renewal, price and indexation mechanism, service levels, owner, and regulatory flags (outsourcing, DORA register). The notice period, not the end date, is the real deadline.</p>
<h4>3. Demand drivers and stakeholders</h4>
<p>What makes the spend go up or down: headcount, sites and square metres for cleaning; users and modules for software; projects and roles for IT consulting; campaigns for agencies. Drivers tell you whether to negotiate price or manage demand. The stakeholder roles from course 1 still apply: budget owner, demand owner, specification owner, gatekeepers.</p>
<h4>4. Total cost of ownership</h4>
<p>Ellram describes TCO as both a methodology and a philosophy: look beyond price to every cost the purchase causes. Her widely used framework groups costs into three phases.</p>
<table class="tbl">
<thead><tr><th>Phase</th><th>Typical costs</th><th>Indirect examples at an insurer</th></tr></thead>
<tbody>
<tr><td><strong>Pre-transaction</strong></td><td>Specification, market research, qualification, onboarding, mobilisation</td><td>Tender effort; mobilisation of a new cleaning supplier; security vetting of new guards; SaaS implementation project</td></tr>
<tr><td><strong>Transaction</strong></td><td>Price, fees, delivery, ordering and invoicing</td><td>Monthly cleaning fee plus extras; consulting day rates plus expenses; agency fees plus production mark-ups</td></tr>
<tr><td><strong>Post-transaction</strong></td><td>Quality failures, contract management, support, switching and exit</td><td>Re-cleaning and complaints; internal FTE to manage 12 consulting firms; licence shelfware; data migration and exit at the end of a software contract</td></tr>
</tbody></table>
<h4>Worked example: a TCO baseline for office cleaning (illustrative)</h4>
<table class="tbl">
<thead><tr><th>Element</th><th>Phase</th><th>Illustrative annual figure</th></tr></thead>
<tbody>
<tr><td>Contract price, 3 sites (Nordvia P1)</td><td>Transaction</td><td>€2.40M</td></tr>
<tr><td>Extras ordered outside the contract (deep cleans, events)</td><td>Transaction</td><td>€0.15M</td></tr>
<tr><td>Internal contract management, 0.5 FTE</td><td>Post-transaction</td><td>€0.04M</td></tr>
<tr><td>Quality failures: complaints, re-cleaning, site manager time</td><td>Post-transaction</td><td>€0.03M</td></tr>
<tr><td>Mobilisation if the supplier changes, spread over the term</td><td>Pre-transaction</td><td>€0.05M</td></tr>
</tbody></table>
<p class="muted small">The extras, contract management and quality figures are illustrative, not case data. The point: a cheaper bid that doubles complaints or needs a costly mobilisation may not be cheaper.</p>
<div class="callout"><strong>Nordvia IT consulting (P2, fictional).</strong> €6.1M a year with 12 firms through 38 call-offs, no framework. The top three firms take 61% of the spend. Day rates for the same senior profile range from 820 to 1,450 euros. The fact base already tells the story: the problem is not a missing tender, it is a missing structure (rate card, panel, call-off rules).</div>`,
      exercise: {
        id: "s1-ex3", title: "Practice 1.3: category fact base and TCO baseline", minutes: 25,
        brief: "Fill the fact base for your project with the data you pulled in the pre-work. Then list the main cost elements beyond price and estimate them. Mark estimates clearly.",
        fields: [
          { key: "facts", type: "pairs", label: "Fact base", items: ["Category and boundaries (what is in, what is out)", "Spend last 12 months (€)", "Number of suppliers and top supplier share", "Buying areas, sites or entities", "Contracts: end date, notice, auto-renewal, indexation", "Last sourcing event and its result", "Main demand drivers", "Key stakeholders (budget, demand, specification owner)"] },
          { key: "tco", type: "rows", label: "TCO baseline", minRows: 5,
            columns: [
              { key: "element", label: "Cost element", type: "text" },
              { key: "phase", label: "Phase", type: "select", options: ["Pre-transaction", "Transaction", "Post-transaction"] },
              { key: "amount", label: "Annual estimate (€K)", type: "number" },
              { key: "source", label: "Source or assumption", type: "text" }
            ] },
          { key: "insight", type: "textarea", label: "The one insight from your fact base that will shape the strategy" }
        ]
      }
    },
    {
      id: "1.4", title: "Know the market", minutes: 35,
      lesson: `
<p class="lead">Spend analysis shows our side. Supply market analysis shows theirs: how many suppliers can really deliver, how they make money, how much capacity they have, and how much they want our business.</p>
<h4>Porter's five forces, from the buyer's chair</h4>
<table class="tbl">
<thead><tr><th>Force</th><th>Question for the buyer</th><th>Cleaning (P1)</th><th>Core software (P3)</th></tr></thead>
<tbody>
<tr><td>Rivalry among suppliers</td><td>How hard do they compete for work like ours?</td><td>High: many local firms</td><td>Low: few platforms</td></tr>
<tr><td>Threat of new entrants</td><td>Can new suppliers appear quickly?</td><td>Medium</td><td>Low: high R&amp;D cost</td></tr>
<tr><td>Substitutes</td><td>Is there another way to meet the need?</td><td>Some: robotics, output specifications</td><td>Long term: other architectures</td></tr>
<tr><td>Supplier power</td><td>Can they dictate price and terms?</td><td>Low to medium</td><td>High: switching takes 18 to 24 months</td></tr>
<tr><td>Our buyer power</td><td>How much does our volume and our choice matter?</td><td>Medium to high</td><td>Low unless bundled</td></tr>
</tbody></table>
<h4>PESTLE, cost drivers and capacity</h4>
<p>PESTLE scans the outside world: Political, Economic, Social, Technological, Legal, Environmental. For indirect categories the useful items are concrete: collective wage agreements in cleaning and security (Economic, Legal), AI in creative production (Technological), DORA and concentration risk for ICT (Legal), ESG reporting duties (Environmental). Then the cost drivers: labour is the dominant cost in cleaning and security, so the wage floor sets the floor of any credible bid; in consulting the drivers are role rates, the seniority pyramid and utilisation; in software, licence metrics and support uplifts. Finally capacity: a market with spare capacity competes; a market at capacity chooses its clients.</p>
<h4>The RFI as a research tool</h4>
<p>An RFI collects information without binding prices. Use it when the market is new or changing, before a framework tender, to pre-qualify on regulatory points (certifications, data location, subcontracting chain, financial standing) or to build a credible alternative to an incumbent. Do not use it when the market is well known (it adds weeks), as free consulting, or when you cannot give a next step. In Coupa, an RFI event collects qualitative information through forms or attachments where pricing is not the point. A two-to-three-week response window is common practice, not a rule.</p>
<h4>How do they see us? Steele &amp; Court's supplier preferencing</h4>
<div class="quad">
<div class="q"><b>Development</b><span>Low value today, attractive account. The supplier invests to grow with us.</span></div>
<div class="q develop"><b>Core</b><span>High value, attractive. The supplier defends the account with service and flexibility.</span></div>
<div class="q"><b>Nuisance</b><span>Low value, unattractive. Little interest; weak service and no flexibility.</span></div>
<div class="q partner"><b>Exploitable</b><span>High value, unattractive. The supplier wants the revenue but will not invest: expect firm prices and uplifts.</span></div>
</div>
<p class="muted small">Vertical: attractiveness of our account to the supplier, low to high. Horizontal: relative value of our account (share of the supplier's business), low to high.</p>
<p>Attractiveness comes from growth, reference value, ease of doing business and payment behaviour. Paying on time does not make us a customer of choice, but paying late makes us less attractive. The model matters because it is the supplier's half of the power picture: if a category is strategic for us but we are Nuisance or Exploitable for the supplier, the strategy must first raise our attractiveness (for example by bundling Group volume) or reduce our dependency.</p>
<div class="callout"><strong>Nordvia, Kelvar (P3, fictional).</strong> €11.2M a year, a 9% uplift at the last renewal, no usage data, an auto-renewal clause. A supplier that imposes uplifts on a customer that never challenges them is behaving as if the account is Exploitable. The evidence for that view is the uplift history; the counter-evidence would be investment, roadmap influence or flexibility. Write down the evidence, not the feeling.</div>
<p>DORA adds one market question for ICT: <strong>concentration risk</strong> (Art. 29). How many alternatives exist, how dependent are we and the Group on one provider, and what sits in the subcontracting chain?</p>`,
      exercise: {
        id: "s1-ex4", title: "Practice 1.4: market snapshot and preferencing position", minutes: 25,
        brief: "Fill the market snapshot for your project. Tick \"assumed\" where you are guessing. Then judge how the incumbent (or the most likely supplier) sees your account, with evidence.",
        fields: [
          { key: "market", type: "canvas", label: "Market snapshot", items: ["Number of credible suppliers", "Rivalry and spare capacity", "Switching cost and time", "Main cost drivers", "Substitutes and new entrants", "PESTLE factors that matter", "Regulatory and concentration risk", "Our buyer power"] },
          { key: "incumbent", type: "text", label: "Incumbent or most likely supplier" },
          { key: "pref", type: "select", label: "Supplier preferencing quadrant", options: ["Core", "Development", "Exploitable", "Nuisance", "No incumbent yet"] },
          { key: "evidence", type: "textarea", label: "Evidence for that position (behaviour, share of their business, growth, service)" },
          { key: "rfi", type: "select", label: "Do you need an RFI?", options: ["No, the market is well known", "Yes, to discover the market", "Yes, to pre-qualify on regulatory points", "Yes, to build an alternative to the incumbent"] },
          { key: "rfiq", type: "textarea", label: "If yes: the five questions your RFI must answer" }
        ]
      }
    },
    {
      id: "1.5", title: "Power decides strategy", minutes: 30,
      lesson: `
<p class="lead">The last step of Insight turns facts into a direction. Three lenses, used together: Kraljic for the buyer's view, Steele &amp; Court for the supplier's view, and the Purchasing Chessboard to turn the power balance into levers.</p>
<h4>Kraljic (1983): profit impact × supply risk</h4>
<div class="quad kraljic">
<div class="q"><b>Bottleneck</b><span>Low impact, high risk. Secure supply, accept a premium if needed, build alternatives.</span></div>
<div class="q develop"><b>Strategic</b><span>High impact, high risk. Long-term partnership, joint development, exit planning.</span></div>
<div class="q"><b>Non-critical</b><span>Low impact, low risk. Simplify: catalogues, standard terms, less effort.</span></div>
<div class="q partner"><b>Leverage</b><span>High impact, low risk. Use buying power: competition, bundling, target prices.</span></div>
</div>
<p class="muted small">Vertical: supply risk, low to high. Horizontal: profit impact, low to high.</p>
<p>Kraljic's article proposes four phases: classify the purchases, analyse the supply market, position by comparing the buyer's bargaining strength with the suppliers', and develop action plans. For strategic items it is usually summarised as a choice between exploiting, balancing or diversifying, depending on that balance of power; check the wording against the HBR text before quoting it. Its limit: it is the buyer's view only, and it is static.</p>
<h4>The Purchasing Chessboard: demand power × supply power</h4>
<p>Schuh, Kromoser, Strohmer, Romero Pérez and Triplat (Kearney) put the two powers on the axes and derive four basic strategies, each opening a set of levers. The grouping of the 16 levers below follows the book.</p>
<table class="tbl">
<thead><tr><th>Position</th><th>Basic strategy</th><th>Levers</th></tr></thead>
<tbody>
<tr><td>Low demand power, low supply power</td><td><strong>Manage spend</strong></td><td>Demand management, co-sourcing, volume bundling, commercial data mining</td></tr>
<tr><td>High demand power, low supply power</td><td><strong>Leverage competition among suppliers</strong></td><td>Tendering, supplier pricing review, globalisation, target pricing</td></tr>
<tr><td>High demand power, high supply power</td><td><strong>Seek joint advantage with supplier</strong></td><td>Value partnership, cost partnership, integrated operations planning, value chain management</td></tr>
<tr><td>Low demand power, high supply power</td><td><strong>Change the nature of demand</strong></td><td>Innovation breakthrough, re-specification, technical data mining, risk management</td></tr>
</tbody></table>
<p><strong>Demand power</strong> grows with volume, bundling across areas and entities, freedom to change the specification, and a credible ability to switch. <strong>Supply power</strong> grows with concentration, proprietary technology, switching cost and scarce capacity.</p>
<h4>Combining the lenses</h4>
<table class="tbl">
<thead><tr><th>Kraljic</th><th>Preferencing</th><th>Direction</th></tr></thead>
<tbody>
<tr><td>Leverage</td><td>Core or Development</td><td>Exploit competition, firm and fair</td></tr>
<tr><td>Leverage</td><td>Nuisance</td><td>Aggregate volume (Group, co-sourcing) to become attractive, then compete</td></tr>
<tr><td>Bottleneck</td><td>Exploitable or Nuisance</td><td>Secure supply, protect the contract, work on alternatives</td></tr>
<tr><td>Strategic</td><td>Core</td><td>Partnership, joint value, open book</td></tr>
<tr><td>Strategic</td><td>Exploitable or Nuisance</td><td>Danger zone: raise attractiveness or reduce dependency; change the nature of demand</td></tr>
</tbody></table>
<div class="callout"><strong>From direction to route (preview of Session 2).</strong> Leverage services such as cleaning and security usually lead to one supplier chosen by tender. Consulting, IT services and agencies, which sit between leverage and strategic, lead to a panel of preferred suppliers. A strategic or bottleneck incumbent such as Kelvar leads to a single-source negotiation, never an auction. Today we only name the direction; the route is decided in Session 2.</div>`,
      exercise: {
        id: "s1-ex5", title: "Practice 1.5: position your project and name the direction", minutes: 20,
        brief: "Score your project from 1 (low) to 5 (high) on each axis, choose the quadrants, and write the strategic direction in one sentence. Use the evidence from Practices 1.3 and 1.4.",
        fields: [
          { key: "kraljic", type: "range", label: "Kraljic scores (1 to 5)", max: 5, parts: ["Profit impact", "Supply risk"] },
          { key: "kq", type: "select", label: "Kraljic quadrant", options: ["Non-critical", "Leverage", "Bottleneck", "Strategic"] },
          { key: "chess", type: "range", label: "Chessboard scores (1 to 5)", max: 5, parts: ["Our demand power", "Supply power"] },
          { key: "cq", type: "select", label: "Chessboard basic strategy", options: ["Manage spend", "Leverage competition among suppliers", "Seek joint advantage with supplier", "Change the nature of demand"] },
          { key: "levers", type: "checks", label: "Levers you will test (choose up to four)", items: ["Demand management", "Co-sourcing", "Volume bundling", "Commercial data mining", "Tendering", "Supplier pricing review", "Globalisation", "Target pricing", "Value partnership", "Cost partnership", "Integrated operations planning", "Value chain management", "Innovation breakthrough", "Re-specification", "Technical data mining", "Risk management"] },
          { key: "direction", type: "textarea", label: "Strategic direction in one sentence (for example: \"Leverage, attractive account: exploit competition through a single-supplier tender on an output specification\")" },
          { key: "challenge", type: "textarea", label: "What would your trio challenge in this positioning?" }
        ]
      }
    }
  ],
  case: {
    title: "Case 1: Nordvia's sourcing pipeline",
    body: `
<p class="lead">Nordvia's Procurement team of 9 runs about 60 sourcing events a year in Coupa. Until now most were RFQs with three quotes, whatever the category. The new Head of Procurement wants every project in the pipeline positioned before anyone chooses a tool.</p>
<p class="small muted">Nordvia Insurance is fictional. Spend in € million a year.</p>
<table class="tbl">
<thead><tr><th>ID</th><th>Category</th><th>Owner</th><th>Spend €M</th><th>Suppliers</th><th>Expiry</th><th>Situation today</th></tr></thead>
<tbody>
<tr><td>P1</td><td>Office cleaning (3 sites, 2 countries)</td><td>Facilities</td><td>2.4</td><td>3 local cleaners</td><td>Jun 2027</td><td>Three contracts rolled over since 2019; quality complaints at HQ</td></tr>
<tr><td>P2</td><td>IT consulting and project staff</td><td>IT</td><td>6.1</td><td>12 firms, 38 call-offs</td><td>No framework</td><td>Day rates for the same senior profile range from 820 to 1,450 euros</td></tr>
<tr><td>P3</td><td>Core insurance software licences (Kelvar)</td><td>IT</td><td>11.2</td><td>1 vendor</td><td>Jun 2027</td><td>9% uplift last time; no usage data; auto-renewal clause</td></tr>
<tr><td>P4</td><td>Network and telecom (Telmo)</td><td>IT</td><td>4.9</td><td>1 provider</td><td>Sep 2026 (extended)</td><td>Rolled over twice; provides services used by claims systems</td></tr>
<tr><td>P5</td><td>Office supplies and print</td><td>General Services</td><td>2.3</td><td>31 suppliers</td><td>Various</td><td>No catalogue; 1,900 purchase orders a year below 1,000 euros</td></tr>
<tr><td>P6</td><td>Security and reception</td><td>Facilities</td><td>1.6</td><td>1 provider</td><td>Dec 2027</td><td>Hourly rates indexed twice in 2 years; no KPIs</td></tr>
<tr><td>P7</td><td>Creative agencies</td><td>Marketing</td><td>7.2</td><td>6 agencies</td><td>No framework</td><td>Overlapping briefs, no rate card, every campaign briefed to a favourite</td></tr>
<tr><td>P8</td><td>Claims IT managed service (Northbyte)</td><td>IT</td><td>19.4</td><td>1 provider</td><td>Dec 2027</td><td>Supports a critical function; in the DORA register; no tested exit plan</td></tr>
</tbody></table>
<p>In your breakout room, position each project on Kraljic and on the Chessboard, guess how the main supplier sees Nordvia, flag the regulatory triage, and name the direction in a few words. Then answer the two questions below. You present in 3 minutes.</p>`,
    exercise: {
      id: "s1-case", title: "Case 1 team answer", minutes: 30,
      brief: "One person per team types the answer; everybody can fill it in for their own notes.",
      fields: [
        { key: "pipeline", type: "rows", label: "Positioning the pipeline", minRows: 8,
          preset: ["P1 Office cleaning", "P2 IT consulting", "P3 Kelvar licences", "P4 Telmo network", "P5 Office supplies and print", "P6 Security and reception", "P7 Creative agencies", "P8 Northbyte claims IT"],
          columns: [
            { key: "p", label: "Project", type: "text" },
            { key: "k", label: "Kraljic", type: "select", options: ["Non-critical", "Leverage", "Bottleneck", "Strategic"] },
            { key: "c", label: "Chessboard", type: "select", options: ["Manage spend", "Leverage competition", "Joint advantage", "Change nature of demand"] },
            { key: "s", label: "How they see us", type: "select", options: ["Core", "Development", "Exploitable", "Nuisance", "Mixed"] },
            { key: "r", label: "Regulatory flag", type: "select", options: ["None", "Personal data", "Staff transfer / labour law", "DORA ICT", "DORA ICT + critical function", "Solvency II outsourcing"] },
            { key: "d", label: "Direction", type: "text" }
          ] },
        { key: "same", type: "textarea", label: "Which projects would \"RFQ with three quotes\" have served badly, and why?" },
        { key: "first", type: "textarea", label: "Which two projects should the team start first, and why (value, risk, timing)?" }
      ]
    }
  },
  fieldwork: {
    title: "Fieldwork 1 (before Session 2)",
    items: [
      { id: "fw1-1", text: "Hold a 45-minute need-validation meeting with the business owner of your Sourcing Case (guide below)." },
      { id: "fw1-2", text: "Complete the data: 24 months of spend by supplier, current contracts with notice periods, indexation and auto-renewal clauses, any Group framework for the category." },
      { id: "fw1-3", text: "Confirm the regulatory triage with Risk, Compliance or Information Security wherever you ticked a yes or a possible yes." },
      { id: "fw1-4", text: "Update your fact base, TCO baseline and positioning in Practices 1.3 to 1.5 with what you learned." },
      { id: "fw1-5", text: "Share your one-page category profile with your trio and collect one challenge." }
    ],
    guide: `
<h4>Need-validation meeting guide (45 minutes)</h4>
<ol>
<li>What outcome do you need from this purchase in the next two to three years? What would make it a success?</li>
<li>What is not working with the current supplier or arrangement? Show me an example.</li>
<li>What will change in volume, sites, users or scope? Which projects or decisions could affect it?</li>
<li>Which parts of the current scope could we drop, simplify or standardise?</li>
<li>Must-haves versus nice-to-haves: which requirements are truly fixed, and why?</li>
<li>Who else uses or depends on this service? Who must approve the decision?</li>
<li>Have you already spoken to suppliers about this? What was said or promised?</li>
<li>Does the service support claims, underwriting, policy administration or another critical function? Does the supplier access our systems or customer data?</li>
<li>Would staff move with the contract if the supplier changed?</li>
<li>What is your budget expectation, and what would make you accept a higher price?</li>
<li>When do you need the new arrangement live, and what happens if it is late?</li>
</ol>
<p class="muted small">Listen for positions ("we need supplier X") and ask for the interest behind them ("what does X give you that matters?"). Do not propose a route to market yet: that is Session 2.</p>`,
    exercise: {
      id: "s1-fw", title: "Need-validation notes", minutes: 0, brief: "Capture what you heard and what changed. You will use it to write the sourcing strategy paper in Session 2.",
      fields: [
        { key: "who", type: "text", label: "Who did you meet, and when?" },
        { key: "confirmed", type: "select", label: "Is the need confirmed?", options: ["Confirmed as defined", "Confirmed with a changed scope", "Reduced or partly cancelled", "Not confirmed yet"] },
        { key: "changed", type: "textarea", label: "What changed in the need, the scope or the timing" },
        { key: "data", type: "pairs", label: "Data collected", items: ["Spend (24 months)", "Contracts and notice periods", "Group frameworks checked", "Regulatory triage confirmed by"] },
        { key: "positions", type: "textarea", label: "Positions you heard, and the interests behind them" },
        { key: "surprise", type: "textarea", label: "What surprised you" }
      ]
    }
  },
  slides: [
    { kind: "title", h: "WHAT are we sourcing?", sub: "Session 1 · From request to category insight" },
    { h: "What we will do today", bullets: ["See S2C as a decision chain of 11 steps", "Run a proper intake and regulatory triage", "Build the category fact base and TCO", "Read the market and how suppliers see us", "Position our project and name the direction"] },
    { kind: "poll", poll: "s1-p1", h: "Check-in" },
    { h: "The rule of this course", bullets: ["Analyse the category and the power position first", "Choose the sourcing strategy second", "Pick the tool last: RFI, RFP, RFQ, auction, mini-competition, negotiation"] },
    { h: "The 11 steps", bullets: ["1–4 Need, category, market, positioning (today)", "5 Sourcing strategy (Session 2)", "6–8 RFx design, engagement, evaluation (Session 3)", "9–11 Negotiation, contract, handover (Session 4)"] },
    { kind: "poll", poll: "s1-p2", h: "Which step do we skip?" },
    { h: "Regulatory triage at intake", bullets: ["Outsourcing of a critical or important function? (Solvency II)", "ICT service under DORA?", "Personal data?", "Staff transfer or agency work?"] },
    { h: "TCO in three phases (Ellram)", table: [["Phase", "Example"], ["Pre-transaction", "Tender effort, mobilisation, vetting"], ["Transaction", "Price, fees, extras"], ["Post-transaction", "Quality failures, contract management, exit"]] },
    { h: "Supplier preferencing (Steele & Court)", bullets: ["Core · Development · Exploitable · Nuisance", "How attractive is our account, and how much is it worth to them?"] },
    { kind: "quad2", h: "Kraljic: profit impact × supply risk" },
    { h: "The Chessboard: four basic strategies", bullets: ["Manage spend", "Leverage competition among suppliers", "Seek joint advantage with supplier", "Change the nature of demand"] },
    { kind: "poll", poll: "s1-p4", h: "Where does Kelvar sit?" },
    { h: "Before Session 2", bullets: ["Need-validation meeting with the business owner", "Complete the spend and contract data", "Confirm the triage with Risk or Compliance", "Update the fact base and positioning"] }
  ],
  polls: [
    { id: "s1-p1", q: "How do most sourcing events in your team start today?", options: ["A request for quotes from the business", "A contract about to expire", "A category plan", "A supplier proposal", "An urgency"] },
    { id: "s1-p2", q: "Which S2C step does your team skip or rush most often?", options: ["Need validation", "Spend and contract analysis", "Market analysis", "Positioning and strategy", "Handover to P2P"] },
    { id: "s1-p3", q: "In your entity, when is the regulatory question (outsourcing, DORA) usually asked?", options: ["At intake", "When drafting the RFx", "At contract stage", "When Risk or Legal raises it", "Rarely"] },
    { id: "s1-p4", q: "Where would you place the Kelvar licence renewal on the Chessboard?", options: ["Manage spend", "Leverage competition among suppliers", "Seek joint advantage with supplier", "Change the nature of demand"] },
    { id: "s1-p5", q: "How confident are you that your Sourcing Case project is the right one?", options: ["Very", "Fairly", "Not yet: I need to check with the business owner"] }
  ],
  facilitator: `
<ul>
<li><strong>Opening (20 min).</strong> Show the course map and the capstone. Check that every participant has a Sourcing Case project. Those without one pick from their contract expiries during the first break; offer the Nordvia P1 cleaning case as a fallback.</li>
<li><strong>1.1.</strong> Do not lecture the 11 steps: let participants map their last three events first, then show the pattern from the submissions (Teacher view, Submissions). Steps 1 to 5 are usually the ones marked rushed or skipped.</li>
<li><strong>1.2.</strong> The triage is not a legal opinion. Insist that Procurement asks the questions and documents the answers with Risk, Compliance and Information Security. Correct anyone who cites the EIOPA cloud guidelines as current: they were withdrawn with effect from 17 January 2025.</li>
<li><strong>1.3.</strong> Push for total contract value (annual × base term plus options). Many participants quote annual figures only, which understates approval levels.</li>
<li><strong>1.4.</strong> Preferencing positions must come with evidence. "I think they like us" is not evidence; uplifts, response times and roadmap access are.</li>
<li><strong>1.5.</strong> Positions are judgements, not calculations. Accept disagreement if the evidence is explicit.</li>
<li><strong>Case, expected answers.</strong> P1 cleaning, P6 security and P5 office supplies and print: leverage (P5 close to non-critical; channel through a catalogue). P2 consulting and P7 creative agencies: leverage moving to strategic, managed through a panel. P3 Kelvar: bottleneck or strategic with high supply power, likely Exploitable; change the nature of demand. P8 Northbyte: strategic, DORA critical function, Solvency II outsourcing to check; exit plan is the gap. P4 Telmo: leverage or bottleneck, DORA ICT service; the rollover itself is the risk.</li>
<li><strong>Breakouts.</strong> Same trios for the whole course. Each trio reviews one member's Sourcing Case at the end of each session.</li>
</ul>`
});
