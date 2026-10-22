window.COURSE = window.COURSE || { sessions: [] };
window.COURSE.sessions.push({
  id: "s2", num: 2,
  title: "WHICH route to market?",
  theme: "Choosing the sourcing strategy",
  question: "Single supplier, panel or negotiation: which strategy fits this category, and why?",
  output: "Sourcing Case part 2: the sourcing strategy paper (route to market) for your project",
  objectives: [
    "Answer the six decisions of a sourcing strategy and explain each choice from the category's power position.",
    "Use the strategy-selection matrix and five route-to-market questions to pick the right pattern, and say why the others were rejected.",
    "Design a single-supplier tender for cleaning, security and similar services: lots, term, specification type, weights and safeguards.",
    "Design a pool of preferred suppliers for professional and IT services: lots, panel size, rate card and call-off rules.",
    "Build a sole-source negotiation strategy for an incumbent software vendor: usage facts, BATNA, unbundling and timing.",
    "Write a one-page sourcing strategy paper for your own project, ready for the business owner and, where needed, Risk and Compliance."
  ],
  prework: {
    minutes: 45,
    items: [
      { id: "s2-pw-read", title: "Three patterns, one logic", minutes: 15, body: `
<p class="lead">Session 1 told you what you are buying and who holds the power. Session 2 decides how you will go to market. The tool (RFP, mini-competition, negotiation, e-auction) comes last.</p>
<p>Most indirect categories in an insurer fall into one of three patterns:</p>
<ul>
<li><b>One supplier, chosen by tender about every three years</b> (cleaning, security, soft FM): one continuous service at our sites, one accountable provider, high cost to switch. Competition happens <em>for</em> the contract.</li>
<li><b>A pool of preferred suppliers with a rate card and mini-competitions</b> (consulting, professional and IT services, agencies): a stream of different assignments. Competition happens <em>within</em> the panel, job by job.</li>
<li><b>Sole- or single-source negotiation</b> (incumbent core software): no realistic alternative in the contract horizon, so value comes from facts, a credible alternative and timing.</li>
</ul>
<p>Around them: <b>RFQ plus e-auction</b> for precise, price-driven buys with enough bidders; <b>catalogues and spot buys</b> for the tail; a <b>multi-stage negotiated process</b> for complex transformations.</p>
<div class="callout"><strong>Read before the class.</strong> Research brief, sections A.3 (single, dual, multi-sourcing) and B.2 (strategy-selection matrix). Optional: Kearney's Purchasing Chessboard, the four basic strategies (Schuh et al.).</div>` },
      { id: "s2-pw-case", title: "Bring your Sourcing Case part 1", minutes: 25, body: `
<p>Open your Sourcing Case part 1 and add three facts:</p>
<ul>
<li>How demand arrives: continuous service, stream of assignments, one-off or many small orders.</li>
<li>How many suppliers could deliver it within the contract horizon, and the cost of switching.</li>
<li>Expiry, notice period and any auto-renewal clause.</li>
</ul>` }
    ],
    quiz: [
      { q: "In what order should a sourcing strategy be built?", options: ["Choose the tool, then the supplier, then the contract", "Category profile and power position, then the strategy decisions, then the tool", "Ask the business which supplier it prefers, then run an RFQ", "Run an RFI, then decide whether a strategy is needed"], answer: 1, why: "The tool follows the strategy, and the strategy follows the power position (Kraljic, Chessboard, CIPS strategy stage)." },
      { q: "Why is office cleaning usually given to one supplier per site or cluster, chosen by tender?", options: ["Because cleaning suppliers refuse to share sites", "Because one accountable provider, volume leverage and high mobilisation cost make one supplier per term the efficient choice", "Because the law requires a single supplier", "Because quality does not matter in cleaning"], answer: 1, why: "Competition takes place for the contract every few years; splitting one site between suppliers adds cost without adding tension." },
      { q: "Nordvia buys IT consulting from 12 firms through 38 call-offs, 29 of them without competition. What is the best route?", options: ["Award everything to the cheapest firm", "An e-auction on day rates", "A panel by lot with a rate card of maximum day rates and clear mini-competition and direct-award rules", "Leave it to IT and approve each call-off"], answer: 2, why: "Assignments differ, so keep several firms, but cap the price and make competition the rule above a threshold." },
      { q: "Kelvar's renewal is coming. Migrating to an alternative platform takes 18 to 24 months. What is the right approach?", options: ["A reverse auction against the two alternatives", "An RFP to Kelvar only, to show compliance", "A sole-source negotiation prepared with usage data, benchmarks, an RFI to alternatives and protections for the next term", "Accept the uplift because there is no choice"], answer: 2, why: "With no real competition in the horizon, value comes from facts, a credible BATNA, unbundling and timing. An auction with one realistic bidder is just an expensive RFQ." },
      { q: "When does an e-auction fit?", options: ["Whenever we want lower prices", "For consulting, if the day rates are comparable", "When the specification is precise, at least four or five qualified bidders compete, price or a formula decides and the relationship can bear it", "Only for software"], answer: 2, why: "These are the preconditions from Smeltzer and Carr, Jap and the EU Directive's Art. 35 test. Session 3 goes deeper." },
      { q: "Which statement about the EIOPA cloud outsourcing guidelines is correct today?", options: ["They are the main rule for ICT contracts", "They were withdrawn with effect from 17 January 2025; DORA now governs ICT third-party risk", "They only apply to reinsurers", "They replaced Solvency II outsourcing rules"], answer: 1, why: "EIOPA withdrew them to avoid overlap with DORA. Solvency II outsourcing rules still apply to critical or important functions." }
    ]
  },
  agenda: [
    ["0:00", "Opening and Fieldwork 1 debrief: what did the business owner confirm?", "Plenary and trios"],
    ["0:15", "2.1 The six decisions of a sourcing strategy", "Input, practice on your project"],
    ["0:55", "2.2 One supplier, chosen by tender: cleaning, security, soft FM", "Input, Nordvia cleaning design"],
    ["1:30", "Break", ""],
    ["1:40", "2.3 A pool of preferred suppliers: professional and IT services", "Input, panel design in breakout rooms"],
    ["2:25", "2.4 When there is no real competition: sole and single source", "Input, Kelvar outline"],
    ["2:55", "Break", ""],
    ["3:05", "2.5 Strategic partnerships, the tail and the strategy paper", "Input, write your one-pager"],
    ["3:30", "Case 2: four Nordvia projects, four routes to market", "Team exercise and debrief"],
    ["3:55", "Close and Fieldwork 2 briefing", ""]
  ],
  modules: [
    {
      id: "2.1", title: "The six decisions of a sourcing strategy", minutes: 40,
      lesson: `
<p class="lead">A sourcing strategy is six decisions taken in order. The RFP, the mini-competition or the negotiation is only the answer to the fifth one.</p>
<p>CIPS makes this choice in its Strategy stage, "based on supply position"; O'Brien in the <b>Innovation</b> stage of his 5i model. The Session 1 analysis (Kraljic, Chessboard, Steele and Court) drives the strategy; the strategy drives the tool.</p>
<table class="tbl">
<thead><tr><th>#</th><th>Decision</th><th>Options</th><th>Driven by</th></tr></thead>
<tbody>
<tr><td>1</td><td>Number of suppliers</td><td>Single, dual, multi (panel), sole</td><td>How demand arrives, supply risk, switching cost</td></tr>
<tr><td>2</td><td>Relationship type</td><td>Transactional, preferred supplier, strategic partner</td><td>Kraljic position, value at stake</td></tr>
<tr><td>3</td><td>Contract architecture</td><td>One-off contract, term contract, framework with call-offs, catalogue, rate card</td><td>Predictability of demand</td></tr>
<tr><td>4</td><td>Commercial model</td><td>Fixed price, unit rates, T&amp;M with rate card, capped T&amp;M, output price, gain-share</td><td>Clarity of scope, who controls the outcome</td></tr>
<tr><td>5</td><td>Competitive mechanism</td><td>RFQ, RFP, multi-stage tender, mini-competition, e-auction, direct award with benchmark, sole-source negotiation</td><td>Number of credible bidders, specification, power balance</td></tr>
<tr><td>6</td><td>Term</td><td>Base term plus options</td><td>Mobilisation and switching cost, market dynamics, exit feasibility</td></tr>
</tbody></table>
<p><b>Decision 1 sets the pattern.</b> Single sourcing (chosen by competition) gives leverage and one accountable party at the cost of dependency in the term: cleaning, security, travel management. Dual sourcing buys continuity and benchmark tension with split volume: telecom, regional temp staffing. A multi-supplier panel gives specialist capability and competition per assignment, but fragments if it grows too large: consulting, IT services, agencies. Sole source is not a choice but a market fact to be managed (Monczka et al.; Lysons and Farrington; research brief A.3). Hackett associates top-performing functions with fewer suppliers per unit of spend (a consultancy benchmark).</p>
<h4>The strategy-selection matrix</h4>
<table class="tbl">
<thead><tr><th>Situation</th><th>Position</th><th>Strategy</th><th>Primary tool</th></tr></thead>
<tbody>
<tr><td>Recurring site service (cleaning, security)</td><td>Leverage</td><td>One supplier, 3 to 5-year cycle</td><td>RFP, weighted quality and price</td></tr>
<tr><td>Stream of specialist jobs (consulting, IT services)</td><td>Leverage to strategic</td><td>Panel with rate card</td><td>Framework RFP, mini-competitions</td></tr>
<tr><td>Proprietary incumbent platform</td><td>Bottleneck or strategic</td><td>Sole-source negotiation, demand change</td><td>Usage audit, benchmark, RFI to alternatives</td></tr>
<tr><td>Standard, precise, price-driven</td><td>Leverage</td><td>Competitive single or dual</td><td>RFQ, English reverse auction</td></tr>
<tr><td>Complex transformation (managed IT, BPO)</td><td>Strategic</td><td>Partnership</td><td>Multi-stage, dialogue, BAFO</td></tr>
<tr><td>Tail</td><td>Non-critical</td><td>Channel and automate</td><td>Catalogue, punch-out, spot buy</td></tr>
</tbody></table>
<h4>Five route-to-market questions, in this order</h4>
<ol>
<li><b>Is there a real alternative within the contract horizon?</b> If not, it is a sole-source negotiation (2.4), whatever the category.</li>
<li><b>How does demand arrive?</b> One continuous service: one supplier by tender (2.2). A stream of different assignments: a panel (2.3). Many small orders: catalogue or spot buy (2.5).</li>
<li><b>Can we specify precisely and rank bids automatically?</b> If yes, with four or five qualified bidders, RFQ and e-auction become possible. If not, RFP and negotiation (Bajari, McMillan and Tadelis 2009; EU Directive 2014/24 Art. 35).</li>
<li><b>Is the solution itself unknown?</b> Then a multi-stage process with dialogue and BAFO (2.5).</li>
<li><b>Does a Group or entity framework already cover it?</b> Then call off from it first.</li>
</ol>
<div class="callout"><strong>Coupa.</strong> Attach the strategy paper to the sourcing request or project before creating the event (check how your tenant links them). The event type (RFI, RFQ, RFP, auction) must follow decision 5, not habit.</div>`,
      exercise: {
        id: "s2-ex1", title: "Practice 2.1: the six decisions for your project", minutes: 15,
        brief: "Take your own Sourcing Case. Bring forward the position from Session 1, then answer the six decisions. For each, write the reason and the option you rejected.",
        fields: [
          { key: "project", type: "text", label: "Your project (category, scope, value per year, expiry)" },
          { key: "kraljic", type: "select", label: "Kraljic position (from Session 1)", options: ["Non-critical", "Leverage", "Bottleneck", "Strategic"] },
          { key: "chess", type: "select", label: "Chessboard basic strategy", options: ["Manage spend", "Leverage competition among suppliers", "Seek joint advantage with supplier", "Change the nature of demand"] },
          { key: "demand", type: "select", label: "How does demand arrive?", options: ["One continuous service", "A stream of different assignments", "A defined one-off requirement", "Many small orders", "A complex transformation"] },
          { key: "decisions", type: "rows", label: "The six decisions", minRows: 6, preset: ["1 Number of suppliers", "2 Relationship type", "3 Contract architecture", "4 Commercial model", "5 Competitive mechanism", "6 Term"],
            columns: [
              { key: "d", label: "Decision", type: "text" },
              { key: "choice", label: "Your choice", type: "text" },
              { key: "why", label: "Why (fact or position)", type: "text" },
              { key: "rejected", label: "Option rejected and why", type: "text" }
            ] }
        ]
      }
    },
    {
      id: "2.2", title: "One supplier, chosen by tender: cleaning, security, soft FM", minutes: 35,
      lesson: `
<p class="lead">For cleaning, security and reception the competition happens once per cycle, for the whole contract. Then one supplier delivers, is measured and is held to account. Make that tender count.</p>
<h4>Why one supplier per site or cluster</h4>
<p><b>Accountability</b> (one provider answers for a building), <b>leverage and density</b> (labour is most of the cost; bundled hours mean better routes and price), <b>mobilisation cost</b> (each change costs recruitment, training, possible staff transfer and a service dip: Ellram's post-transaction costs) and <b>simple governance</b> (one set of KPIs, one review, one invoice).</p>
<h4>Why three years plus options</h4>
<p>The base term lets the supplier recover mobilisation and investment and lets us recover our switching cost; 12-month options are exercised only if performance earns them. Public examples: a UK university cleaning contract, 3 years + 2 × 12 months, 50/50 quality and price (2024); HMRC integrated FM, 5 + 3 + 1 + 1 (2024). For an insurer's cleaning or security, <b>3 + 1 + 1</b> is a sound default (practice, not a norm).</p>
<h4>Specification: input, output or hybrid</h4>
<table class="tbl">
<thead><tr><th>Type</th><th>Describes</th><th>Strength</th><th>Risk</th></tr></thead>
<tbody>
<tr><td>Input</td><td>Hours, frequencies, headcount</td><td>Easy to audit and compare</td><td>No innovation; you pay for hours, not results</td></tr>
<tr><td>Output</td><td>Results: cleanliness standards, response times</td><td>Supplier proposes the method, often at lower cost</td><td>Harder to draft and to evaluate</td></tr>
<tr><td>Hybrid</td><td>Outputs for most areas, prescribed methods where we need control</td><td>The usual best fit</td><td>Needs clear boundaries</td></tr>
</tbody></table>
<p class="muted small">CMS (Hanson, 2000); Singapore NEA outcome-based cleaning guide. For security, prescribe procedures, vetting and licences.</p>
<h4>Safeguards that belong in the strategy, not only in the RFP</h4>
<ul>
<li><b>Weights:</b> quality at least 50%, fixed before issue.</li>
<li><b>Should-cost floor:</b> hours × collective wage + on-costs, supervision, consumables, overhead, margin. Below it: an abnormally low bid; ask for an explanation.</li>
<li><b>Staff transfer:</b> Acquired Rights Directive 2001/23/EC and national rules (TUPE, collective agreements). Staff data in the RFP; realistic savings.</li>
<li><b>Indexation</b> by wage-index formula once a year; <b>KPIs</b> with service credits.</li>
<li><b>No price-only auction.</b> If any auction, only among bidders above a quality threshold and the should-cost floor.</li>
</ul>
<div class="callout"><strong>Nordvia (fictional).</strong> P1 office cleaning: 3 sites, 2 countries, €2.4M, three local cleaners rolled over since 2019, HQ complaints, expiry June 2027. P6 security and reception (€1.6M, one provider, rates indexed twice in two years, no KPIs) follows the same logic with more weight on vetting and licences.</div>
<div class="callout"><strong>Coupa.</strong> RFP event, one lot per country (items in a lot are awarded together), quality questionnaires, pricing template, draft contract attached; option dates as CLM alerts. Weighted scoring and sealed opening: check in your tenant.</div>`,
      exercise: {
        id: "s2-ex2", title: "Practice 2.2: the Nordvia cleaning re-tender", minutes: 15,
        brief: "Design the tender strategy for Nordvia P1 (office cleaning, 3 sites, 2 countries, €2.4M a year, expiry June 2027). If your own project is a site service, add one line on how you would adapt it.",
        fields: [
          { key: "lots", type: "select", label: "Lot structure", options: ["One lot, all three sites", "One lot per country", "One lot per site", "One lot per country, with a bundle discount for both"] },
          { key: "term", type: "select", label: "Term", options: ["2 years", "3 years", "3 years + 1 + 1", "5 years"] },
          { key: "spec", type: "select", label: "Specification type", options: ["Input", "Output", "Hybrid"] },
          { key: "weights", type: "split", label: "Evaluation weights (%)", parts: ["Quality", "Price"] },
          { key: "safe", type: "checks", label: "Safeguards in your strategy", items: ["Should-cost floor from the collective wage", "Staff transfer data in the RFP", "Wage-index indexation formula", "Clarification of abnormally low bids", "Site visits before bidding", "KPIs with service credits", "Fair-labour and ESG checks", "No price-only auction"] },
          { key: "timeline", type: "textarea", label: "Plan back from June 2027: when must the RFP be issued, awarded and mobilised?" },
          { key: "own", type: "textarea", label: "Your own project: what would you keep and what would you change?" }
        ]
      }
    },
    {
      id: "2.3", title: "A pool of preferred suppliers: professional and IT services", minutes: 45,
      lesson: `
<p class="lead">Professional and IT services arrive as a stream of different assignments. No single firm is best at all of them, and a full RFP per assignment is too slow. The answer is a pool of preferred suppliers: a framework with a rate card, mini-competitions and clear direct-award rules.</p>
<table class="tbl">
<thead><tr><th>Approach</th><th>What happens</th></tr></thead>
<tbody>
<tr><td>One supplier for everything</td><td>Dependency, capability gaps, no tension</td></tr>
<tr><td>Open market for every assignment</td><td>Weeks per RFP; in practice people skip it and pick a favourite</td></tr>
<tr><td>No rules (today's reality)</td><td>Fragmented spend, same profile at very different rates</td></tr>
<tr><td><b>Panel by lot with rate card</b></td><td>Ceilings fixed once; 3 to 6 pre-qualified firms compete per job</td></tr>
</tbody></table>
<h4>The reference model</h4>
<p>EU Directive 2014/24 Art. 33: a framework of at most four years; call-offs by <b>direct award</b> where all terms are fixed (objective criteria, cascade or rotation) or by <b>mini-competition</b> where not (all capable members invited in writing, a sufficient deadline, bids closed until it). The UK CCS consultancy framework RM6187 adds lots by capability, <b>maximum day rates</b>, at least 10 working days for simple requirements, quality 50 to 90%, three evaluators and a consensus meeting. Public rules, used here as a benchmark.</p>
<h4>Designing the panel</h4>
<ol>
<li><b>Lots by capability:</b> e.g. IT delivery; technology advisory; IT staff augmentation; regulatory and actuarial advisory.</li>
<li><b>Panel size:</b> three to six per lot is common practice; too many and members stop investing in you.</li>
<li><b>Rate card:</b> maximum day rates by role and seniority, volume tiers, expenses policy, indexation cap.</li>
<li><b>Call-off rules</b> (illustrative, align to your delegation of authority): below €50K direct award at or below rate card with a written rationale; €50K to €250K mini-competition with at least three invited; above €250K or strategic, presentations or a full RFP.</li>
<li><b>Call-off template:</b> SOW with deliverables, acceptance criteria, pricing model, named key people, knowledge transfer. Fixed price per deliverable by default, capped T&amp;M otherwise, pure T&amp;M only for discovery (UK Consultancy Playbook, 2022).</li>
<li><b>Governance:</b> quarterly scorecards, share-of-wallet review, refresh and exit.</li>
</ol>
<h4>Two insurer-specific traps</h4>
<ul>
<li><b>Labour law in staff augmentation:</b> choose between a service contract (supplier owns the outcome and directs its people) and labelled agency work. In Germany the AÜG limits leasing the same worker to the same client to 18 consecutive months, and sham service contracts can create an employment relationship with the client (verify with Legal).</li>
<li><b>DORA:</b> IT services with system access are likely ICT services: register of information and Art. 30 clauses. Put them in the framework so every call-off inherits them, and run the Art. 28(4) pre-contract assessment once at panel level.</li>
</ul>
<div class="callout"><strong>Nordvia P2 (fictional).</strong> €6.1M with 12 firms through 38 call-offs; top 3 take 61%; 29 call-offs without competition; 820 to 1,450 euros a day for the same senior profile. <strong>Group (anonymised):</strong> IT services about €80M with some 350 suppliers; advisory firms about €12M in 9 entities through 60 supplier records, no Group agreement.</div>
<div class="callout"><strong>Insurance analogue.</strong> Zurich cut its England and Wales claims legal panel from 28 to 14 firms (2004); the Co-operative Insurance Society planned to go from 27 to possibly six, citing unequal work distribution (<em>The Lawyer</em>).</div>
<div class="callout"><strong>Coupa.</strong> Framework and rate card in CLM; mini-competitions as short RFP events from a template sent to the lot's members; Q&amp;A in the Message Center; requisitions reference the framework, so off-panel spend shows.</div>`,
      exercise: {
        id: "s2-ex3", title: "Practice 2.3: design the Nordvia IT services panel", minutes: 20,
        brief: "Check the two numbers, then design the panel for Nordvia P2. If your own project is a professional or IT service, design your own panel in the same table.",
        fields: [
          { key: "q1", type: "check", label: "Share of the 38 call-offs awarded without competition (%)", answer: 76, tol: 1, hint: "29 out of 38." },
          { key: "q2", type: "check", label: "How much higher is the highest day rate than the lowest for the same profile (%)?", answer: 77, tol: 1, hint: "(1,450 − 820) ÷ 820." },
          { key: "lots", type: "rows", label: "Lots and panel size", minRows: 3,
            columns: [
              { key: "lot", label: "Lot", type: "text" },
              { key: "scope", label: "Scope", type: "text" },
              { key: "n", label: "Firms on the panel", type: "number" },
              { key: "model", label: "Default pricing", type: "select", options: ["Fixed price per deliverable", "Capped T&M", "T&M with rate card", "Managed service price"] }
            ] },
          { key: "rates", type: "rows", label: "Rate card structure (illustrative maximum day rates)", minRows: 4,
            columns: [
              { key: "role", label: "Role", type: "text" },
              { key: "level", label: "Seniority", type: "select", options: ["Junior", "Consultant", "Senior", "Manager", "Principal"] },
              { key: "max", label: "Max day rate (€)", type: "number" }
            ] },
          { key: "rules", type: "pairs", label: "Call-off rules", items: ["Below €50K", "€50K to €250K", "Above €250K or strategic", "Urgent need", "Follow-on work for the same firm"] },
          { key: "risk", type: "textarea", label: "Labour-law and DORA safeguards for the staff augmentation lot" }
        ]
      }
    },
    {
      id: "2.4", title: "When there is no real competition: sole and single source", minutes: 30,
      lesson: `
<p class="lead">An RFP sent to a vendor who knows it cannot lose is theatre, and an auction with one realistic bidder is an expensive RFQ. When there is no real competition, prepare a negotiation and change the nature of demand.</p>
<p><b>Sole source:</b> no alternative exists (proprietary IP). <b>Single source:</b> alternatives exist, but switching is slow or costly. Most incumbent software is single source, a weaker vendor position than it looks.</p>
<h4>Read the power balance three ways</h4>
<ul>
<li><b>Kraljic:</b> bottleneck or strategic.</li>
<li><b>Steele and Court:</b> a mid-sized insurer is often a <em>nuisance</em> or <em>exploitable</em> account for a global vendor. Strategic for us and exploitable for them is the danger zone: raise attractiveness (Group volume, reference value, easy payment) or reduce dependency.</li>
<li><b>Chessboard:</b> high supply power calls for "change the nature of demand": re-specification, technical data mining, innovation breakthrough.</li>
</ul>
<h4>The sole-source playbook</h4>
<ol>
<li><b>Start early:</b> 12 to 18 months before renewal (practitioner rule). The notice date is the real deadline.</li>
<li><b>Know usage:</b> entitlement against deployment (shelfware), users, modules.</li>
<li><b>Build a credible BATNA</b> (Fisher and Ury): RFI to alternatives, architecture study, reduced scope. A bluff that is called destroys your position.</li>
<li><b>Benchmark</b> price per user or module, discounts, uplift caps: objective criteria.</li>
<li><b>Unbundle</b> licences, support, cloud subscription and services; trade term for price and protection.</li>
<li><b>Protect the next term:</b> uplift caps, price holds, right to reduce, transition assistance, data portability; DORA Art. 30(3)(f) exit clauses where a critical or important function is supported.</li>
<li><b>One voice:</b> IT, Finance and Procurement aligned; nobody pre-commits.</li>
</ol>
<div class="callout"><strong>Nordvia P3 (fictional).</strong> Kelvar, €11.2M a year, 9% uplift last time, renewal June 2027, 9-month notice, auto-renewal clause. An estimated 20 to 25% of named-user licences unused; two credible platforms, migration 18 to 24 months: not a replacement by June 2027, but a credible BATNA for the next term and a lever for protections now.</div>
<div class="callout"><strong>Direct award with benchmark</strong> is the small brother: below thresholds, follow-on work, bottleneck items. Document the justification, benchmark, negotiate, approve one level higher; avoid evergreen awards and contract splitting.</div>
<div class="callout"><strong>Coupa.</strong> No auction, no RFP for show. An RFI event to alternatives builds the BATNA; CLM alerts on the notice date; the justification recorded in the contract workflow.</div>`,
      exercise: {
        id: "s2-ex4", title: "Practice 2.4: sole-source renewal outline", minutes: 12,
        brief: "Outline the negotiation strategy for Kelvar (or for your own sole- or single-source project). Tick \"assumed\" where you still need to check a fact.",
        fields: [
          { key: "q1", type: "check", label: "Illustrative: if half of the €11.2M were named-user licences and 20% of them unused, what is the annual value of the shelfware (€M)?", answer: 1.12, tol: 0.05, hint: "11.2 × 50% × 20%." },
          { key: "canvas", type: "canvas", label: "Negotiation strategy outline", items: ["Usage facts (entitlement vs deployment)", "Our BATNA and how we make it credible", "Benchmarks and should-cost", "What we unbundle", "Protections for the next term", "Timeline back from the notice date", "One voice: who speaks for us", "What we can give that is cheap for us"] }
        ]
      }
    },
    {
      id: "2.5", title: "Strategic partnerships, the tail and the strategy paper", minutes: 25,
      lesson: `
<p class="lead">At one end of the map, a few complex, high-risk deals need a multi-stage negotiated process. At the other, thousands of small orders need a channel, not a tender. Both need a decision on paper.</p>
<h4>Complex and transformational deals</h4>
<p>Managed IT, claims IT and BPO cannot be fully specified upfront. Borrow the structure of the EU competitive procedure with negotiation and competitive dialogue: RFI, RFP stage 1, shortlist of three or four, dialogue workshops, BAFO against fixed criteria. Chessboard: "seek joint advantage". Exit feasibility and concentration risk are strategy criteria.</p>
<table class="tbl">
<thead><tr><th>Regulatory question</th><th>Effect on the strategy</th></tr></thead>
<tbody>
<tr><td>Critical or important outsourcing? (Solvency II Art. 49; Del. Reg. 2015/35 Art. 274)</td><td>Prior supervisor notification in the timeline; detailed provider examination</td></tr>
<tr><td>ICT for a critical or important function? (DORA Art. 28)</td><td>Pre-contract assessment, concentration risk, tested exit strategy</td></tr>
<tr><td>Any ICT service?</td><td>Register of information; Art. 30(2) clauses</td></tr>
</tbody></table>
<p class="muted small">EIOPA's cloud outsourcing guidelines were withdrawn from 17 January 2025. Legal and Compliance own the interpretation.</p>
<h4>The tail: channel, do not source</h4>
<p>McKinsey (2018): tail spend is 80 to 90% of items, 10 to 20% of spend, 5 to 15% savings potential. In our Group, suppliers below €50K are 86% of records and 12% of spend. Consolidate to one or two catalogue suppliers by RFQ (an e-auction fits if the basket is precise and four or five qualified bidders compete), then catalogues, punch-out and guided buying; Spot Buy for genuine one-offs.</p>
<div class="callout"><strong>Nordvia P5 (fictional).</strong> Office supplies and print: €2.3M, 31 suppliers, 1,900 POs a year below 1,000 euros, no catalogue. Check for a Group framework; otherwise RFQ on a basket, English reverse auction if enough bidders qualify, punch-out catalogue; print as a separate lot.</div>
<h4>The one-page sourcing strategy paper</h4>
<ol>
<li><b>Need and scope:</b> value, expiry, notice date.</li>
<li><b>Position:</b> Kraljic, Chessboard, how the incumbent sees us.</li>
<li><b>Route to market:</b> the six decisions, one line each.</li>
<li><b>Options rejected</b> and why.</li>
<li><b>Timeline</b> back from the notice date.</li>
<li><b>Risks and regulatory path:</b> outsourcing, DORA, data, labour law.</li>
<li><b>Decision requested</b> from the business owner and, where flagged, Risk and Compliance.</li>
</ol>`,
      exercise: {
        id: "s2-ex5", title: "Practice 2.5: your one-page sourcing strategy paper", minutes: 12,
        brief: "Write the first version of your strategy paper. Short lines, facts, decisions. You will finish it with the business owner in Fieldwork 2.",
        fields: [
          { key: "route", type: "select", label: "Route to market", options: ["Call-off from an existing Group or entity framework", "One supplier chosen by tender", "Panel of preferred suppliers with rate card and mini-competitions", "Sole- or single-source negotiation", "RFQ and e-auction", "Catalogue or spot buy", "Multi-stage negotiated process (partnership)"] },
          { key: "paper", type: "pairs", label: "Strategy paper", items: ["1 Need and scope", "2 Position", "3 Route to market (six decisions)", "4 Options rejected and why", "5 Timeline from the notice date", "6 Risks and regulatory path", "7 Decision requested and from whom"] }
        ]
      }
    }
  ],
  case: {
    title: "Case 2: Four projects, four routes to market",
    body: `
<p class="lead">Nordvia's Procurement team of 9 runs about 60 sourcing events a year in Coupa. Until now most were RFQs with three quotes, whatever the category. The Head of Procurement wants a route-to-market decision for four projects in the pipeline, each justified with the strategy-selection matrix.</p>
<table class="tbl">
<thead><tr><th>Project</th><th>Owner</th><th>€M a year</th><th>Suppliers</th><th>Expiry</th><th>Today</th></tr></thead>
<tbody>
<tr><td>P1 Office cleaning (3 sites, 2 countries)</td><td>Facilities</td><td>2.4</td><td>3 local cleaners</td><td>Jun 2027</td><td>Three contracts rolled over since 2019; quality complaints at HQ</td></tr>
<tr><td>P2 IT consulting and project staff</td><td>IT</td><td>6.1</td><td>12 firms, 38 call-offs</td><td>No framework</td><td>Day rates for the same senior profile range from 820 to 1,450 euros</td></tr>
<tr><td>P3 Core insurance software licences (Kelvar)</td><td>IT</td><td>11.2</td><td>1 vendor</td><td>Jun 2027</td><td>9% uplift last time; no usage data; auto-renewal clause</td></tr>
<tr><td>P5 Office supplies and print</td><td>General Services</td><td>2.3</td><td>31 suppliers</td><td>Various</td><td>No catalogue; 1,900 purchase orders a year below 1,000 euros</td></tr>
</tbody></table>
<p>Extra facts: Kelvar has a 9-month notice period; an estimated 20 to 25% of named-user licences are unused; two credible platforms exist, with a migration of 18 to 24 months. In IT consulting, the top 3 firms take 61% of the spend and 29 of the 38 call-offs had no competition.</p>`,
    exercise: {
      id: "s2-case", title: "Case 2 team answer", minutes: 25,
      brief: "For each project choose the route to market, the number of suppliers, the mechanism and the term. Justify each with the matrix, and name the first step.",
      fields: [
        { key: "routes", type: "rows", label: "Route to market per project", minRows: 4, preset: ["P1 Office cleaning", "P2 IT consulting", "P3 Kelvar licences", "P5 Office supplies and print"],
          columns: [
            { key: "p", label: "Project", type: "text" },
            { key: "route", label: "Route", type: "select", options: ["One supplier by tender", "Panel with rate card", "Sole-source negotiation", "RFQ and e-auction", "Catalogue or spot buy", "Multi-stage negotiated", "Group framework call-off"] },
            { key: "n", label: "Suppliers", type: "select", options: ["1", "1 per lot", "2", "3 to 6 per lot", "Sole"] },
            { key: "term", label: "Term", type: "text" },
            { key: "why", label: "Why (position and facts)", type: "text" },
            { key: "first", label: "First step", type: "text" }
          ] },
        { key: "never", type: "textarea", label: "One thing you would never do on each project, and why" }
      ]
    }
  },
  fieldwork: {
    title: "Fieldwork 2 (before Session 3)",
    items: [
      { id: "fw2-1", text: "Finish the one-page sourcing strategy paper for your project." },
      { id: "fw2-2", text: "Walk the business owner through it in 30 minutes: route to market, options rejected, timeline back from the notice date." },
      { id: "fw2-3", text: "Where the triage flagged outsourcing, DORA, personal data or staff transfer, get Risk and Compliance input on the regulatory path." },
      { id: "fw2-4", text: "Confirm whether a Group or entity framework already covers the need, and check the current contract's notice date." },
      { id: "fw2-5", text: "Record the agreed paper with your Sourcing Case and bring it to Session 3." }
    ],
    guide: `<p>You are not asking for permission to run a tender. You are agreeing how the business will buy: one supplier, a panel or a negotiation, and why. Lead with the problem the business recognises (complaints at HQ, rates that vary by 77%, a 9% uplift), then the route, then the rejected options. Expect the classic pushbacks: "we already have a favourite supplier" (the panel and direct-award rules answer it), "a tender takes too long" (the timeline from the notice date answers it), "the vendor will not negotiate" (the BATNA and the usage facts answer it).</p>`,
    exercise: {
      id: "s2-fw", title: "Strategy paper agreement", minutes: 0, brief: "What the business owner and Risk and Compliance said, and what changed.",
      fields: [
        { key: "status", type: "select", label: "Status of the strategy paper", options: ["Agreed by the business owner", "Agreed with changes", "Escalated for a decision", "Not yet discussed"] },
        { key: "changes", type: "rows", label: "Feedback and changes", minRows: 3,
          columns: [
            { key: "who", label: "Who", type: "text" },
            { key: "said", label: "What they said", type: "text" },
            { key: "change", label: "What changed in the paper", type: "text" }
          ] },
        { key: "reg", type: "textarea", label: "Regulatory path agreed with Risk and Compliance (if relevant)" }
      ]
    }
  },
  slides: [
    { kind: "title", h: "WHICH route to market?", sub: "Session 2 · Choosing the sourcing strategy" },
    { h: "The tool follows the strategy", bullets: ["Category profile and power position first", "Then the six decisions", "Only then the RFP, mini-competition, negotiation or auction"] },
    { h: "Three patterns for an insurer", table: [["Pattern", "Categories"], ["One supplier by tender, 3 + 1 + 1", "Cleaning, security, soft FM"], ["Panel with rate card and mini-competitions", "Consulting, IT services, agencies"], ["Sole-source negotiation", "Incumbent core software"]] },
    { kind: "poll", poll: "s2-p2", h: "IT consulting: what first?" },
    { h: "Before Session 3", bullets: ["Finish the one-page strategy paper", "Agree it with the business owner", "Get Risk and Compliance input where triage flagged it"] }
  ],
  polls: [
    { id: "s2-p1", q: "Did you validate the need with your business owner in Fieldwork 1?", options: ["Yes, need and scope confirmed", "Yes, but the scope changed", "Meeting booked, not yet held", "Not yet"] },
    { id: "s2-p2", q: "Nordvia IT consulting: 12 firms, 38 call-offs, rates from 820 to 1,450 euros. What would you do first?", options: ["Award everything to the cheapest firm", "Run an e-auction on day rates", "Build a panel by lot with a rate card and call-off rules", "Leave it to IT"] },
    { id: "s2-p3", q: "Kelvar: what is Nordvia's strongest lever today?", options: ["A reverse auction", "The usage facts and a credible alternative for the next term", "Threatening to leave by June 2027", "Accepting the uplift for a longer term"] },
    { id: "s2-p4", q: "Which route will your own project take?", options: ["One supplier by tender", "Panel of preferred suppliers", "Sole- or single-source negotiation", "RFQ and e-auction", "Catalogue or Group framework call-off", "Multi-stage negotiated process"] }
  ],
  facilitator: `
<p><b>The one message of the day:</b> three patterns, one logic. Repeat it at every module close: one supplier by tender for continuous site services, a panel for streams of assignments, a negotiation when there is no real competition. The logic is in the five route-to-market questions; insist that participants answer them in order, starting with "is there a real alternative?"</p>
<ul>
<li><b>Opening (15 min).</b> Poll s2-p1, then trios: what did the business owner confirm or change? Collect two examples of scope that changed after the conversation.</li>
<li><b>2.1 (40 min).</b> Walk the six decisions with Nordvia P1 as running example. Stress that decision 5 (mechanism) is the fifth, not the first. Practice: participants fill the six rows for their own project; walk the room and challenge the "option rejected" column, which is where thinking shows.</li>
<li><b>2.2 (35 min).</b> Expected answer for P1: one lot per country (different collective agreements and markets) with a bundle option, 3 + 1 + 1, hybrid specification, quality at least 50%, should-cost floor, staff transfer data. Accept one lot for all three sites if the team argues for one provider across two countries, but ask how they handle two labour regimes. Push back on price-only auctions. Timeline: a standard tender needs 9 to 12 months before expiry plus mobilisation, so P1 is already tight; a short bridge extension of the current contracts is a defensible fallback if it is a decision, not a roll-over.</li>
<li><b>2.3 (45 min).</b> Check answers: 76% of call-offs without competition; the top rate is 77% above the lowest. A good panel: two or three lots (delivery, advisory, staff augmentation), three to five firms per lot, maximum day rates by role and seniority, thresholds aligned to the delegation of authority, fixed price per deliverable by default. Ask who would lose under the new rules and how the business owner will react: the favourite firm can join the panel if it competes.</li>
<li><b>2.4 (30 min).</b> Correct shelfware check: €1.12M (illustrative). The key insight: Kelvar cannot be replaced by June 2027, so the alternatives are a BATNA for the next term and for protections, not a threat to walk away now. The 9-month notice period means the notice date, not June 2027, is the real deadline: ask teams to compute it and to check what the auto-renewal clause triggers. Ban the word "auction" for P3.</li>
<li><b>2.5 (25 min).</b> Briefly cover Northbyte (P8) as the partnership example: DORA critical, no tested exit plan, expiry December 2027, so a multi-stage process must start now. Then P5 as the tail example. Participants write their one-pager draft.</li>
<li><b>Case (25 min).</b> Expected routes: P1 one supplier per lot by RFP; P2 panel with rate card; P3 sole-source negotiation with BATNA building; P5 Group framework check, then RFQ plus English reverse auction for a catalogue contract and punch-out. Strong teams also say what they would never do: auction cleaning on price only, auction consulting, RFP Kelvar for show, tender 1,900 small orders.</li>
<li><b>Close.</b> Poll s2-p4 on routes chosen; brief Fieldwork 2. Remind participants that Session 3 designs the RFx and the evaluation model, so the strategy paper must be agreed before then.</li>
</ul>
<p class="muted small">Evidence notes: contract terms such as 3 + 1 + 1, panel sizes of three to six, the 12 to 18-month preparation rule and vendor year-end timing are practice, not norms. Thresholds and rate cards in the exercises are illustrative. Coupa weighted scoring, sealed opening and auction settings must be confirmed in the tenant.</p>`
});
