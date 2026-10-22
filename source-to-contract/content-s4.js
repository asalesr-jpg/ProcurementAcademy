window.COURSE = window.COURSE || { sessions: [] };
window.COURSE.sessions.push({
  id: "s4", num: 4,
  title: "HOW do we close it well?",
  theme: "Negotiation, contract and handover",
  question: "How do we negotiate the best deal, sign the right contract and make it work?",
  output: "Sourcing Case complete: negotiation plan, contract checklist and handover plan",
  objectives: [
    "Plan a negotiation on one page: power, BATNA, targets, walk-away, concessions and roles.",
    "Choose the negotiation mode for each negotiation type, and Coupa's role in it.",
    "Write an award recommendation and structure a contract that protects the value.",
    "Build Solvency II outsourcing and DORA requirements into the contract.",
    "Hand the contract over so that it is used, measured and renewed on purpose."
  ],
  prework: {
    minutes: 45,
    items: [
      { id: "s4-pw-read", title: "Negotiation is prepared, not improvised", minutes: 15, body: `
<p class="lead">A negotiation is mostly decided before the meeting: by power, by each side's alternatives and by preparation.</p>
<p>Fisher and Ury (<em>Getting to Yes</em>, 1981): separate people from the problem; focus on <strong>interests</strong>, not positions; invent options for mutual gain; use <strong>objective criteria</strong> (benchmarks, should-cost). Your power is your <strong>BATNA</strong>, the Best Alternative To a Negotiated Agreement: improve it first, never accept less. It sets your <strong>walk-away</strong>; the overlap with the seller's walk-away is the <strong>ZOPA</strong> (Raiffa, 1982).</p>
<div class="callout">O'Brien's Red Sheet® method (<em>Negotiation for Procurement and Supply Chain Professionals</em>, 2025) puts the plan on one page. Today you build one in that spirit.</div>` },
      { id: "s4-pw-reg", title: "Three regulatory facts for insurance buyers", minutes: 12, body: `
<ol>
<li><strong>Solvency II:</strong> the insurer remains fully responsible for what it outsources (Directive 2009/138/EC, Art. 49). Outsourcing a critical or important function needs prior notification to the supervisor and a written agreement with the content of Delegated Regulation (EU) 2015/35, Art. 274.</li>
<li><strong>DORA</strong> (Regulation (EU) 2022/2554, applicable since 17 January 2025) covers every ICT service contract: pre-contract assessment, register of information, mandatory clauses (Art. 30) and tested exit strategies for critical or important functions.</li>
<li><strong>EIOPA's cloud outsourcing guidelines were withdrawn</strong> with effect from 17 January 2025. Do not quote them as current.</li>
</ol>
<p class="muted small">Orientation, not legal advice: Legal and Compliance confirm classification and clauses.</p>` },
      { id: "s4-pw-prep", title: "Bring your Sourcing Case", minutes: 18, body: `<p>Open parts 1 to 3 of your Sourcing Case. Bring the current contract with its end date, notice period and any auto-renewal clause, and the name of your counterpart.</p>` }
    ],
    quiz: [
      { q: "What is a BATNA?", options: ["Your lowest hoped-for price", "What you will do if there is no agreement", "The supplier's opening offer", "The approved budget"], answer: 1, why: "It sets your walk-away point." },
      { q: "A supplier insists on four years. \"What makes four years important to you?\" is…", options: ["Anchoring", "Exploring the interest behind a position", "A conditional concession", "A walk-away"], answer: 1, why: "The interest may be paying back an investment, which other terms can solve." },
      { q: "Which is the worst fit for an e-auction?", options: ["Laptops, six qualified bidders", "Office supplies, fixed basket", "Renewal of a proprietary core software licence", "Mobile tariffs, five operators"], answer: 2, why: "With one realistic supplier an auction is a bluff. Negotiate on data." },
      { q: "Which contracts go into the DORA register of information?", options: ["Cloud contracts only", "Critical or important functions only", "All ICT contractual arrangements", "Contracts above €1M"], answer: 2, why: "All ICT arrangements, flagging those supporting critical or important functions." },
      { q: "EIOPA's cloud outsourcing guidelines are…", options: ["Current and binding", "Replaced by new 2025 guidelines", "Withdrawn from 17 January 2025", "Only for reinsurers"], answer: 2, why: "Withdrawn to avoid duplication with DORA." },
      { q: "What makes a signed contract deliver value?", options: ["Filing it", "Making it the easy way to buy, and measuring it", "Auto-renewal", "Emailing it to the business"], answer: 1, why: "Buying channel, KPIs, governance and a renewal decision." }
    ]
  },
  agenda: [
    ["0:00", "Opening and Fieldwork 3 debrief", "Plenary and trios"],
    ["0:15", "4.1 Negotiation planning", "Your negotiation one-pager"],
    ["0:55", "4.2 E-negotiation by negotiation type", "Six scenarios"],
    ["1:25", "Case 4, part 1: the Kelvar renewal", "Role-play in breakout rooms"],
    ["2:05", "Break", ""],
    ["2:15", "4.3 Award and contract", "Cleaning award recommendation"],
    ["2:45", "4.4 Contracts in a regulated insurer", "Clause checklist; Case 4, part 2: Northbyte"],
    ["3:20", "Break", ""],
    ["3:30", "4.5 Handover: from contract to value", "Your first 90 days"],
    ["3:50", "Capstone briefing and course close", ""]
  ],
  modules: [
    {
      id: "4.1", title: "Negotiation planning", minutes: 40,
      lesson: `
<p class="lead">Negotiations are won before the meeting: know the power, both sides' alternatives, the issues and what you can trade.</p>
<h4>Start from power</h4>
<p>Kraljic (1983) gives your view, Steele and Court's supplier preferencing (1996) the supplier's view, the Kearney Purchasing Chessboard the basic strategy.</p>
<table class="tbl"><thead><tr><th>Our position</th><th>Their view of us</th><th>Stance</th></tr></thead><tbody>
<tr><td>Leverage</td><td>Core or development</td><td>Use competition, firm and fair</td></tr>
<tr><td>Leverage</td><td>Nuisance</td><td>Aggregate volume to become attractive</td></tr>
<tr><td>Bottleneck</td><td>Exploitable or nuisance</td><td>Secure supply, protect the future, build alternatives</td></tr>
<tr><td>Strategic</td><td>Core</td><td>Partnership, joint value, open book</td></tr>
<tr><td>Strategic</td><td>Exploitable or nuisance</td><td>Danger zone: raise attractiveness or change the nature of demand</td></tr>
</tbody></table>
<h4>Interests, alternatives, zone of agreement</h4>
<ul>
<li><strong>Interests, not positions</strong> (Fisher and Ury): "four years" is a position; "pay back the floor robots" is the interest.</li>
<li><strong>BATNA</strong>: ours is improved by work (RFI to alternatives, a second supplier, re-specification, insourcing); theirs is estimated.</li>
<li><strong>Opening, target, walk-away</strong> per issue. Targets rest on objective criteria: benchmark, should-cost, Ellram's TCO.</li>
<li><strong>ZOPA</strong>: if none exists, change the scope, not your walk-away.</li>
</ul>
<h4>Issues and concessions</h4>
<p>Price, term, indexation, volume flexibility, payment terms, SLAs, service credits, exit support: multi-issue deals create value before claiming it (Lax and Sebenius, 1986). Trade what is cheap for us and valuable to them; every concession conditional ("if you…, then we…"), smaller each time, recorded.</p>
<h4>One page, one team</h4>
<p>In the spirit of O'Brien's Red Sheet®: objectives, facts, power, both BATNAs, issues with opening, target and walk-away, concessions, opening statement, roles, mandate. Roles: <strong>lead negotiator</strong> (speaks, concedes), <strong>analyst</strong> (numbers, notes), <strong>business owner</strong> (confirms needs, never concedes in the room), <strong>executive sponsor</strong>. Align your own side first, Walton and McKersie's intra-organisational bargaining, or the supplier will negotiate with your stakeholders.</p>`,
      exercise: {
        id: "s4-ex1", title: "Practice 4.1: negotiation one-pager", minutes: 15,
        brief: "Prepare the negotiation of your Sourcing Case.",
        fields: [
          { key: "power", type: "select", label: "Power position", options: ["Leverage, they want us", "Leverage, we are small to them", "Bottleneck", "Strategic, mutual interest", "Strategic, we are exploitable or a nuisance", "Non-critical"] },
          { key: "batna", type: "pairs", label: "Interests and alternatives", items: ["Our interests", "Their likely interests", "Our BATNA and how we strengthen it", "Their BATNA (estimated)"] },
          { key: "issues", type: "rows", label: "Issues", minRows: 4,
            columns: [
              { key: "issue", label: "Issue", type: "text" },
              { key: "open", label: "Opening", type: "text" },
              { key: "target", label: "Target", type: "text" },
              { key: "walk", label: "Walk-away", type: "text" },
              { key: "prio", label: "Priority", type: "select", options: ["High", "Medium", "Low"] }
            ] },
          { key: "conc", type: "rows", label: "Concessions", minRows: 3,
            columns: [
              { key: "give", label: "We can give", type: "text" },
              { key: "cost", label: "Cost to us", type: "select", options: ["Low", "Medium", "High"] },
              { key: "get", label: "Only in exchange for", type: "text" }
            ] },
          { key: "roles", type: "pairs", label: "Team roles", items: ["Lead negotiator", "Analyst", "Business owner", "Executive sponsor"] }
        ]
      }
    },
    {
      id: "4.2", title: "E-negotiation by negotiation type", minutes: 30,
      lesson: `
<p class="lead">E-negotiation is a mechanism that serves a negotiation type. Decide the type, then the mechanism, then configure Coupa.</p>
<table class="tbl"><thead><tr><th>Type</th><th>Mechanism</th><th>Coupa's role</th></tr></thead><tbody>
<tr><td><strong>Competitive leverage</strong> (supplies, print, hardware, mobile)</td><td>RFQ, then English reverse auction if the preconditions hold; Japanese reverse if incumbent-heavy; Dutch reverse for speed</td><td>RFQ as pre-bidding phase, then the auction; rank or gap-to-best feedback. Overtime and minimum decrement: confirm in your tenant</td></tr>
<tr><td><strong>Quality-led services</strong> (cleaning, security, SaaS selection)</td><td>RFP with fixed evaluation model, shortlist, negotiation rounds, BAFO; price auction only above a quality threshold, with caution</td><td>RFP with questionnaires and lots; follow-on event for BAFO; Message Center. Weight configuration and sealed envelopes: confirm in your tenant</td></tr>
<tr><td><strong>Panels</strong> (consulting, IT services, agencies)</td><td>Mini-competition per call-off (three or more invited above the threshold) or documented direct award</td><td>Short RFP event from a template with rate card and SOW</td></tr>
<tr><td><strong>Sole or single source</strong> (incumbent software)</td><td>Face-to-face, data-driven, executive; RFI to alternatives to make the BATNA credible</td><td>Spend and contract data, RFI event, CLM redlines and approvals. Never an auction</td></tr>
<tr><td><strong>Strategic partnership</strong> (managed services, BPO)</td><td>RFI, RFP, dialogue workshops, BAFO against fixed criteria</td><td>Staged follow-on events, audit trail</td></tr>
<tr><td><strong>Multi-lot and bundles</strong> (multi-site FM, telecom lines)</td><td>Combinatorial bids and scenarios</td><td>Sourcing Optimization: package bids, constraints, what-if scenarios</td></tr>
</tbody></table>
<h4>What never to do</h4>
<ul>
<li><strong>Auction as a bluff</strong>, without the intention or ability to award (trust damage: Jap 2003).</li>
<li><strong>Post-auction renegotiation</strong> or changed rules after the close.</li>
<li><strong>Phantom bidders</strong> to create pressure.</li>
<li><strong>One or two bidders:</strong> over a third of US federal reverse auctions in FY2012 had no interactive bidding (GAO-14-108).</li>
<li><strong>Intellectual or complex work:</strong> excluded from e-auctions in EU public procurement (Directive 2014/24/EU, Art. 35); auctions perform poorly for complex, incompletely specified work with few bidders (Bajari, McMillan and Tadelis, 2009).</li>
<li><strong>Price-only auctions for labour-intensive services</strong> without a quality threshold and wage-floor check.</li>
</ul>`,
      exercise: {
        id: "s4-ex2", title: "Practice 4.2: choose the negotiation mode", minutes: 10,
        brief: "Choose the mode and the Coupa set-up for each scenario, then for your own project.",
        fields: [
          { key: "modes", type: "rows", label: "Scenarios", minRows: 7,
            preset: ["Office supplies catalogue: fixed basket, six qualified suppliers", "HQ cleaning: four bids, two above the quality threshold", "Senior developer for six months under the IT services panel", "Kelvar core licence renewal", "Northbyte claims IT managed service at end of term", "Telecom lines for 40 sites in three countries, bundle discounts", "My Sourcing Case"],
            columns: [
              { key: "sc", label: "Scenario", type: "text" },
              { key: "mode", label: "Mode", type: "select", options: ["RFQ then English reverse auction", "Japanese reverse auction", "RFP, negotiation rounds and BAFO", "Panel mini-competition", "Documented direct award", "Sole-source negotiation", "Multi-stage dialogue and BAFO", "Sourcing Optimization"] },
              { key: "coupa", label: "Coupa set-up", type: "text" }
            ] }
        ]
      }
    },
    {
      id: "4.3", title: "Award and contract", minutes: 30,
      lesson: `
<p class="lead">Leverage is highest before signature: what is not in the contract will not happen.</p>
<h4>Award recommendation</h4>
<p>One document approvers can sign without reopening the file: scope and value, process, evaluation with weight sensitivity, treatment of abnormally low bids, negotiation outcome against target and baseline, TCO, due diligence (financial, information security, regulatory), regulatory classification, recommendation with conditions, approvals under the delegation of authority.</p>
<h4>Courtesy period and debrief</h4>
<p>Public law imposes a standstill period; privately, a short courtesy period and a written debrief to each unsuccessful bidder are good practice (CCS requires written feedback): their scores, strengths and weaknesses, never another bidder's prices.</p>
<h4>Contract structure</h4>
<table class="tbl"><thead><tr><th>Element</th><th>Get right</th></tr></thead><tbody>
<tr><td>Architecture</td><td>MSA plus SOWs or call-offs for panels; one term contract for cleaning or security; catalogue contract for the tail</td></tr>
<tr><td>SLAs</td><td>A few measurable KPIs; service credits with a cap and a measurement method</td></tr>
<tr><td>Price</td><td>Fixed price, unit rates, capped T&amp;M, gain-share. Indexation yearly, labour share only, named wage index, capped</td></tr>
<tr><td>Term</td><td>Base term to recover mobilisation, options (e.g. 3+1+1) tied to performance</td></tr>
<tr><td>Exit</td><td>Termination for cause and convenience, change of control, transition assistance, data return</td></tr>
<tr><td>Protection</td><td>Data processing agreement, security, liability and insurance, audit, subcontracting, continuity</td></tr>
</tbody></table>
<p>With the draft contract attached to the RFP, deviations were already in the bids. In Coupa CLM: Group template, clause library in Word, approval workflow with audit trail, date alerts for options and notice periods.</p>`,
      exercise: {
        id: "s4-ex3", title: "Practice 4.3: award recommendation, Nordvia HQ cleaning", minutes: 12,
        brief: "Bidder C was excluded: its staffing hours failed the wage-floor check. B and D were within 0.1 points, so a BAFO round was run (illustrative): B €600K, quality 74; D €632K, quality 81, now accepting 3+1+1 with KPI-based options. Weights 50/50; price score = lowest price ÷ bid × 100.",
        fields: [
          { key: "scoreB", type: "check", label: "Bidder B total after BAFO", answer: 87.0, tol: 0.15, hint: "74 × 0.5 + 100 × 0.5" },
          { key: "scoreD", type: "check", label: "Bidder D total after BAFO", answer: 88.0, tol: 0.15, hint: "81 × 0.5 + (600 ÷ 632 × 100) × 0.5" },
          { key: "award", type: "select", label: "Recommended bidder", options: ["Bidder A", "Bidder B", "Bidder D", "Re-tender"] },
          { key: "why", type: "textarea", label: "Rationale, including the result with 60/40 quality/price" },
          { key: "cond", type: "textarea", label: "Conditions for the contract (KPIs, indexation, staff transfer, exit)" }
        ]
      }
    },
    {
      id: "4.4", title: "Contracts in a regulated insurer", minutes: 35,
      lesson: `
<p class="lead">Some clauses are not negotiable. Negotiate <em>how</em> they are met (pooled audits, certifications), never <em>whether</em>.</p>
<h4>Classify first</h4>
<p>With the outsourcing and DORA owners: outsourcing? of a critical or important function? ICT service? supporting a critical or important function? personal data? staff transfer? Cleaning, catering, agencies, print and travel are usually not critical outsourcing; IT services, cloud, data storage, policy-admin software support and some BPO may be. It is the insurer's own documented assessment.</p>
<h4>Solvency II</h4>
<p><strong>Art. 49 Directive:</strong> the insurer stays fully responsible; critical outsourcing must not impair governance, unduly raise operational risk, impair supervision or undermine service to policyholders; the supervisor is notified before. <strong>Art. 274 Delegated Regulation 2015/35:</strong> written policy, careful provider selection, and a written agreement with cooperation with the supervisor, notice periods long enough to find an alternative, termination without detriment to continuity, access to information and premises for insurer, auditor and supervisor, and sub-outsourcing conditions.</p>
<h4>DORA</h4>
<table class="tbl"><thead><tr><th>Article</th><th>In S2C</th></tr></thead><tbody>
<tr><td>28(4) pre-contract assessment</td><td>Critical function? risks incl. concentration (Art. 29)? due diligence? conflicts of interest?</td></tr>
<tr><td>28(3) register of information</td><td>Every ICT arrangement; templates in Implementing Regulation (EU) 2024/2956</td></tr>
<tr><td>28(7) termination; 28(8) exit</td><td>Mandatory termination rights; exit strategies documented, tested and reviewed for critical functions</td></tr>
<tr><td>30(2) all ICT contracts</td><td>Services and subcontracting, service and data locations, data access and return, service levels, incident assistance, cooperation with authorities, termination and notice, security training</td></tr>
<tr><td>30(3) critical or important</td><td>Quantitative SLAs, reporting, contingency plans, threat-led penetration testing, unrestricted audit and access, exit with adequate transition period</td></tr>
</tbody></table>
<p>One written document (Art. 30(1)); detail in Delegated Regulations 2024/1773 and 2025/532.</p>
<div class="callout"><strong>Withdrawn:</strong> EIOPA's cloud outsourcing guidelines (2020) no longer apply from 17 January 2025. For ICT the regime is DORA, plus Solvency II where it is critical outsourcing.</div>
<p>Also: the GDPR data processing agreement, staff-transfer rules in cleaning and security, agency-work rules for IT staff augmentation. In Coupa, keep these clauses as CLM templates and the DORA questionnaire in supplier onboarding. Whether Coupa feeds the register: confirm with the Group's DORA register owner. <span class="muted small">Orientation only; Legal and Compliance confirm.</span></p>`,
      exercise: {
        id: "s4-ex4", title: "Practice 4.4: regulatory annex checklist", minutes: 12,
        brief: "Classify your project and check the draft contract. Mark gaps for Legal and Compliance.",
        fields: [
          { key: "class", type: "checks", label: "Classification (to confirm)", items: ["Outsourcing (Solvency II)", "Critical or important function", "ICT service (DORA)", "ICT supporting a critical or important function", "Personal data", "Staff transfer possible"] },
          { key: "clauses", type: "rows", label: "Clauses", minRows: 8,
            preset: ["Services and subcontracting", "Service and data locations", "Data access, recovery and return", "Service levels", "Incident assistance, cooperation with authorities", "Audit, access and inspection", "Termination rights and notice", "Exit strategy and transition period"],
            columns: [
              { key: "cl", label: "Clause", type: "text" },
              { key: "basis", label: "Required by", type: "select", options: ["DORA 30(2)", "DORA 30(3)", "Solvency II Art. 274", "GDPR", "Group policy", "Good practice"] },
              { key: "in", label: "In the draft?", type: "select", options: ["Yes", "Partly", "No", "N/A"] },
              { key: "owner", label: "Gap owner", type: "text" }
            ] }
        ]
      }
    },
    {
      id: "4.5", title: "Handover: from contract to value", minutes: 20,
      lesson: `
<p class="lead">A contract nobody buys against is a document, not a deal.</p>
<ul>
<li><strong>Mobilisation:</strong> cleaning and security: staff transfer, induction, KPI baseline in month one. IT services: knowledge transfer, access, DORA register entry, exit plan owner. Panels: onboarding, call-off templates.</li>
<li><strong>Live in Coupa:</strong> CLM record linked to the supplier; catalogue, punch-out or contract-backed buying; price lists so invoices are validated against contract prices; date alerts; supplier onboarded.</li>
<li><strong>Governance:</strong> monthly operations, quarterly business review, annual strategy review for key suppliers. Effort follows value and risk (O'Brien on SRM; Kraljic).</li>
<li><strong>Savings:</strong> baseline and method agreed with Finance beforehand. Planning assumption in the Group: about 6% per three-year cycle (2% savings plus 4% cost avoidance).</li>
<li><strong>Renewal:</strong> a decision date well before the notice deadline, in the pipeline. Telmo rolled over twice; Kelvar auto-renewed at +9%: never again.</li>
</ul>
<table class="tbl"><thead><tr><th>Days</th><th>Focus</th></tr></thead><tbody>
<tr><td>0–30</td><td>Live in Coupa, kick-off, transition milestones, KPI definitions</td></tr>
<tr><td>31–60</td><td>First KPI report, issue log, users on the new channel</td></tr>
<tr><td>61–90</td><td>First review, first savings report with Finance, lessons learned</td></tr>
</tbody></table>`,
      exercise: {
        id: "s4-ex5", title: "Practice 4.5: handover and first 90 days", minutes: 10,
        brief: "Plan your Sourcing Case from signature to first review.",
        fields: [
          { key: "owner", type: "text", label: "Contract owner after signature" },
          { key: "channel", type: "select", label: "Buying channel in Coupa", options: ["Catalogue", "Punch-out", "Contract-backed requisitions", "Framework call-offs", "Recurring PO", "To confirm"] },
          { key: "plan", type: "rows", label: "First 90 days", minRows: 4,
            columns: [{ key: "what", label: "Activity", type: "text" }, { key: "who", label: "Owner", type: "text" }, { key: "when", label: "By when", type: "text" }] },
          { key: "kpis", type: "textarea", label: "Three KPIs and how they are measured" },
          { key: "renew", type: "text", label: "Renewal decision date and notice deadline" }
        ]
      }
    }
  ],
  case: {
    title: "Case 4: The Kelvar renewal and the Northbyte exit gap",
    body: `
<p class="lead">Part 1: a sole-source renewal role-play. Part 2 (Module 4.4): the Northbyte exit gap.</p>
<table class="tbl"><thead><tr><th>Kelvar (fictional)</th><th>Value</th></tr></thead><tbody>
<tr><td>Annual spend</td><td>€11.2M, core insurance software licences</td></tr>
<tr><td>Last renewal</td><td>+9%, under an auto-renewal clause</td></tr>
<tr><td>Renewal and notice</td><td>June 2027; notice 9 months before</td></tr>
<tr><td>Usage</td><td>An estimated 20–25% of named-user licences unused</td></tr>
<tr><td>Alternatives</td><td>Two credible platforms; migration 18–24 months</td></tr>
</tbody></table>
<p><strong>Buyer brief.</strong> A protective notice was served in time: without a new agreement the contract ends in June 2027. Kelvar opened at +9% (about €12.2M a year) for five years. Honest BATNA: no migration is possible by then, but the CIO approved an RFI to both alternatives and a 12–24-month bridge on reduced users, then migration. Illustrative targets: about €10.0M a year after removing unused users; uplift cap 3%; three years with the right to reduce volume 10% a year; transition assistance. The software supports critical functions, so DORA Art. 30(3) clauses are not negotiable. Walk-away (illustrative): €11.2M flat for three years with reduction rights and DORA clauses. Check whether other Group entities license Kelvar.</p>
<details class="hidden-facts teacher-only"><summary>Seller brief (send privately to the Kelvar account manager)</summary>
<p>Your fiscal year ends in May and this deal is in your forecast: signing before year end matters more than the last euro. Kelvar wants customers on its SaaS edition, and an insurance reference in this region would help. Nordvia costs little to serve and has had nothing new in years. Open at +9% and five years. Your limits (illustrative): down to about €10.3M a year for three years, a joint SaaS evaluation in 2028 and a reference; uplift cap 3%. You dislike unlimited on-site audits but accept the DORA clauses through certifications and pooled audits. Reveal the year-end and SaaS interests only if asked good questions.</p></details>
<p class="muted small">Rooms of four: lead buyer, analyst, seller, observer (notes first offer, each concession, interests found).</p>
<p><strong>Part 2: Northbyte.</strong> Claims IT managed service, €19.4M a year to December 2027, supports a critical function, in the DORA register, no tested exit plan. Find the gaps against DORA Art. 28(8) and 30(3); decide what must happen before end 2027, and whether a renewal triggers Solvency II notification.</p>`,
    exercise: {
      id: "s4-case", title: "Case 4: negotiation record and Northbyte actions", minutes: 45,
      brief: "Record your outcome against the plan, then the Northbyte actions.",
      fields: [
        { key: "role", type: "select", label: "My role", options: ["Lead buyer", "Analyst", "Kelvar account manager", "Observer"] },
        { key: "outcome", type: "rows", label: "Outcome per issue", minRows: 5,
          preset: ["Annual price", "Uplift cap", "Term", "Volume flexibility", "Exit and DORA clauses"],
          columns: [
            { key: "issue", label: "Issue", type: "text" },
            { key: "agreed", label: "Agreed", type: "text" },
            { key: "vs", label: "Against plan", type: "select", options: ["Better than target", "At target", "Between target and walk-away", "Beyond walk-away"] }
          ] },
        { key: "interests", type: "textarea", label: "Seller interests found, and the question that revealed them" },
        { key: "northbyte", type: "textarea", label: "Northbyte: three exit-plan gaps and one action each" }
      ]
    }
  },
  fieldwork: {
    title: "Fieldwork 4 (before the capstone)",
    items: [
      { id: "fw4-1", text: "Agree the negotiation one-pager and mandate with the business owner." },
      { id: "fw4-2", text: "Review the regulatory checklist with Legal or Compliance." },
      { id: "fw4-3", text: "Agree the handover plan with the future contract owner." },
      { id: "fw4-4", text: "Put the renewal decision date into the sourcing pipeline." },
      { id: "fw4-5", text: "Rehearse the capstone with your trio." }
    ],
    guide: `<p>The capstone is about four weeks away. Your Sourcing Case is complete when the power position explains the strategy, the strategy explains the event and negotiation, and the contract and handover protect the result. A case the business owner has not seen does not pass.</p>`,
    exercise: {
      id: "s4-fw", title: "Sourcing Case readiness", minutes: 0, brief: "Where your Sourcing Case stands.",
      fields: [
        { key: "parts", type: "checks", label: "Reviewed with the business owner", items: ["Need, category and power", "Strategy paper", "RFx plan and evaluation model", "Negotiation plan", "Contract and regulatory checklist", "Handover plan"] },
        { key: "self", type: "range", label: "Self-assessment (1–5)", parts: ["Insight and power", "Strategy", "Event and negotiation", "Contract and regulation", "Handover"], max: 5 },
        { key: "trio", type: "textarea", label: "Trio feedback" }
      ]
    }
  },
  slides: [],
  polls: [
    { id: "s4-p1", q: "Did your business owner validate the evaluation weights before issue?", options: ["Yes, unchanged", "Yes, with changes", "Not yet", "No competitive event in my case"] },
    { id: "s4-p2", q: "Where did the Kelvar annual price land in your room?", options: ["Below €10.3M", "€10.3M to €10.8M", "€10.8M to €11.2M", "Above €11.2M or no deal"] },
    { id: "s4-p3", q: "Which contract area is weakest in your entity today?", options: ["KPIs and service credits", "Indexation", "Exit and transition", "Regulatory clauses", "Renewal management"] },
    { id: "s4-p4", q: "How ready is your Sourcing Case?", options: ["All parts drafted", "Three parts", "Two or fewer", "I need help"] }
  ],
  facilitator: `
<ul>
<li>Send the Kelvar seller brief (Case tab) privately to one participant per room; a colleague from IT vendor management makes a good seller. 10 minutes preparation, 20 negotiation, 5 observer feedback; compare results with poll s4-p2.</li>
<li>Module 4.4 is orientation, not legal advice. Never present EIOPA's withdrawn cloud guidelines as current. Invite a Compliance or DORA register colleague for Northbyte if possible.</li>
<li>Coupa: only documented features as fact. Overtime, minimum decrement, sealed envelopes, multi-attribute live auctions and weight configuration: check in the Group's tenant.</li>
<li>Book capstone dates and panels before the session ends.</li>
</ul>`
});

window.COURSE.capstone = {
  title: "Capstone: My Sourcing Case",
  body: `
<p class="lead">About four weeks after Session 4, each participant presents their Sourcing Case in 10 minutes plus 5 minutes of questions to a panel: the Head of Procurement, a business owner and a Risk or Compliance colleague. Online, cameras on.</p>
<h4>What to present</h4>
<ol>
<li>Need and category: validated need, spend, TCO baseline, market</li>
<li>Power position: Kraljic, supplier preferencing, Chessboard strategy</li>
<li>Sourcing strategy: the six decisions, the route to market, why not the alternatives</li>
<li>Event or negotiation design: RFx plan, evaluation model, e-negotiation mode, Coupa set-up</li>
<li>Negotiation plan or outcome: BATNA, targets, walk-away, concessions</li>
<li>Contract and regulatory checklist</li>
<li>Handover plan, first 90 days, renewal decision date</li>
</ol>
<div class="callout"><strong>The rule.</strong> The tool follows the strategy. Expect "why this route and not another?" A case the business owner has not seen does not pass.</div>
<h4>Assessment</h4>
<table class="tbl"><thead><tr><th>Criterion</th><th>Weight</th><th>What good looks like</th></tr></thead><tbody>
<tr><td>Category insight and power</td><td>20%</td><td>Accurate facts; a power position the panel can follow</td></tr>
<tr><td>Strategy and route to market</td><td>25%</td><td>Six decisions answered; route follows from power; alternatives weighed</td></tr>
<tr><td>Event and negotiation design</td><td>20%</td><td>Fair, comparable event or credible negotiation plan; e-negotiation only where it fits</td></tr>
<tr><td>Contract and regulation</td><td>20%</td><td>Contract protects value; classification confirmed; required clauses in</td></tr>
<tr><td>Handover and value</td><td>15%</td><td>Owner, channel, KPIs, savings method with Finance, renewal date</td></tr>
</tbody></table>
<h4>How we will know the course worked</h4>
<table class="tbl"><thead><tr><th>Indicator</th><th>Target after 12 months</th></tr></thead><tbody>
<tr><td>Events above €250K with an approved strategy paper</td><td>At least 80%</td></tr>
<tr><td>E-auctions run only after the preconditions check</td><td>All</td></tr>
<tr><td>Renewals decided before the notice deadline</td><td>At least 90%, no unreviewed auto-renewals</td></tr>
<tr><td>New or renewed ICT contracts with DORA clauses and register entry</td><td>All</td></tr>
</tbody></table>`
};
