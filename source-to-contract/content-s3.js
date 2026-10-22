window.COURSE = window.COURSE || { sessions: [] };
window.COURSE.sessions.push({
  id: "s3", num: 3,
  title: "HOW do we run the event?",
  theme: "RFx, evaluation and e-auctions in Coupa",
  question: "How do we design and run a fair, effective competitive event?",
  output: "Sourcing Case part 3: RFx plan, evaluation model and e-negotiation design for your project",
  objectives: [
    "Choose the event sequence (RFI, RFP, RFQ, multi-stage, BAFO, auction) that follows from your sourcing strategy, and plan its timeline.",
    "Design a request that makes bids comparable: specification, lots, pricing schedule, knock-out criteria and a weighted evaluation model fixed before issue.",
    "Run the event fairly: equal treatment, Q&A in the Coupa Message Center, individual scoring and consensus, abnormally low bids and due diligence.",
    "Decide when an e-auction helps and when it hurts, and choose the right format, using the evidence (Jap, Emiliani & Stec, Bajari, McMillan & Tadelis, EU Directive 2014/24 Art. 35).",
    "Set up the event in Coupa Sourcing, and know which settings to confirm in your own tenant."
  ],
  prework: {
    minutes: 45,
    items: [
      { id: "s3-pw-read", title: "The tool follows the strategy", minutes: 20, body: `
<p class="lead">In Session 2 you chose the route to market for your project. Today you design the event that delivers it. The order never changes: category and power position first, sourcing strategy second, tool third.</p>
<p>Three questions decide most event designs. <strong>Can we specify precisely, and can bids be ranked automatically?</strong> If yes, an RFQ or an auction is possible; if not, an RFP with negotiation. This is also the legal test that EU Directive 2014/24 Art. 35 sets for public e-auctions, which excludes services whose subject is "intellectual performances, such as the design of works". <strong>Are there enough qualified, interested suppliers?</strong> Smeltzer &amp; Carr (2003) suggest at least four to five bidders before an auction makes sense. <strong>What does the relationship need to look like after award?</strong> Jap (2003, 2007) found that open-bid auctions raised supplier suspicion more than sealed bids, while buyer savings did not differ between formats.</p>
<div class="callout"><strong>The evidence in one paragraph.</strong> The academic literature quotes typical e-auction price reductions of 5–15% (Jap 2002; Smeltzer &amp; Carr 2003, as summarised by Mora Cortez et al. 2023). Emiliani &amp; Stec (2002) found that the savings actually achieved were lower than those reported by auction service providers. Bajari, McMillan &amp; Tadelis (2009) found that auctions "perform poorly when projects are complex, contractual design is incomplete and there are few bidders". Auctions are a sharp tool for well-specified leverage categories, and a blunt one everywhere else.</div>
<p>A note on Coupa vocabulary. Coupa's <strong>Dutch reverse auction</strong> is a buyer-controlled clock: the price starts <em>low</em> and rises by a pre-set amount until the first supplier accepts. Many web sources describe a Dutch auction as a falling price; that is the selling version. In this course we use Coupa's definition.</p>` },
      { id: "s3-pw-pack", title: "Bring your strategy paper and one old RFx", minutes: 20, body: `
<p>Bring your approved one-page strategy paper from Fieldwork 2. Then open one RFx your team ran in Coupa in the last year and note: which event type was used, whether a draft contract was attached, when the weights were fixed, how many suppliers actually bid, and how the price was scored. You will compare it with good practice in modules 3.1 and 3.2.</p>` }
    ],
    quiz: [
      { q: "Your strategy paper says: incumbent proprietary software, two alternatives with an 18–24 month migration. Which event?", options: ["An RFP to all vendors to see what happens", "An English reverse auction", "A sole/single-source negotiation, with an RFI to the alternatives to make the BATNA credible", "An RFQ with three quotes"], answer: 2, why: "The tool follows the strategy. With one realistic supplier an RFP for show or an auction damages credibility; the RFI only serves to build the BATNA." },
      { q: "In Coupa, what is a Dutch reverse auction?", options: ["The price starts high and falls until a supplier accepts", "The price starts low and rises by pre-set steps; the first supplier to accept wins", "Suppliers bid down and the lowest bid at close wins", "Suppliers must accept each step and the last one active wins"], answer: 1, why: "Coupa documents the Dutch reverse auction as a buyer-controlled clock that starts low and rises. Option 3 is the English reverse and option 4 the reverse Japanese auction." },
      { q: "When should the evaluation weights be fixed?", options: ["After the first bids arrive, to see what matters", "Before the RFx is issued, and disclosed to bidders", "During the consensus meeting", "After the auction"], answer: 1, why: "Weights set after bids arrive are an equal-treatment and governance failure. Fix and disclose them before issue." },
      { q: "Which situation fits an e-auction best?", options: ["Creative agency selection", "IT consulting for a transformation programme", "Standard office supplies catalogue with six qualified suppliers and a fixed item list", "Renewal of the core insurance platform"], answer: 2, why: "Precise specification, enough qualified bidders, price decides, low switching cost. The other three fail at least one precondition." },
      { q: "A cleaning bid is far below the others and its staffing hours look below the wage floor. What do you do first?", options: ["Award it: it is the cheapest", "Reject it immediately", "Ask the bidder in writing to explain the price and the hours, then decide on the evidence", "Show the other bidders its price"], answer: 2, why: "Treat it as a potentially abnormally low bid: ask for an explanation (as CCS guidance does), check it against a should-cost model, document the decision." },
      { q: "What does the literature say about realised auction savings?", options: ["They are always above 20%", "They are usually lower than auction providers report (Emiliani & Stec 2002)", "They are higher for complex services", "There is no research on it"], answer: 1, why: "Gross price reductions differ from net savings. Typical quoted reductions are 5–15%, not a guarantee." }
    ]
  },
  agenda: [
    ["0:00", "Fieldwork 2 debrief: what the business owner changed in your strategy paper", "Breakout trios, then plenary"],
    ["0:15", "3.1 The RFx toolbox", "Input and event sequence for your project"],
    ["0:45", "3.2 Designing the request", "Input and your weighted evaluation model"],
    ["1:25", "Break", ""],
    ["1:35", "3.3 Running it fairly: Q&A, evaluation, award decision", "Evaluate the Nordvia cleaning bids"],
    ["2:15", "3.4 E-auctions: when they work and when they hurt", "Auction suitability check"],
    ["2:50", "Break", ""],
    ["3:00", "3.5 Coupa Sourcing in practice", "Your Coupa event set-up sheet"],
    ["3:30", "Case 3: the HQ cleaning lot, end to end", "Teams, then plenary"],
    ["3:55", "Close and Fieldwork 3 briefing", ""]
  ],
  modules: [
    {
      id: "3.1", title: "The RFx toolbox", minutes: 30,
      lesson: `
<p class="lead">Every tool answers a different question. An RFI asks "who can do this, and how?", an RFP "what would you do, and at what price?", an RFQ "what is your price for this exact thing?". An auction asks "how low will you go, live?". Choose the question before the tool.</p>
<table class="tbl"><thead><tr><th>Tool</th><th>Use it to</th><th>Use it when</th><th>Do not use it when</th><th>In Coupa</th></tr></thead><tbody>
<tr><td>RFI</td><td>Discover the market, pre-qualify, test the specification, build a BATNA</td><td>New or changing category; unknown market; before a framework tender; against an incumbent</td><td>The market is known (it adds weeks); as free consulting</td><td>RFI event: forms and attachments, no pricing</td></tr>
<tr><td>RFP</td><td>Collect solution and price where the "how" matters</td><td>Cleaning, security, FM, consulting, agencies, IT services, SaaS, frameworks</td><td>Pure commodities; sole-source situations</td><td>RFP event: prices and information in the same event</td></tr>
<tr><td>RFQ</td><td>Get prices for a defined requirement</td><td>Standard items, unchanged renewals, pre-bid phase before an auction</td><td>The specification is unclear or solutions differ</td><td>RFQ event (items and lots); Spot Buy for urgent one-offs</td></tr>
<tr><td>Multi-stage</td><td>Reduce bidders step by step on complex needs</td><td>Managed services, BPO, transformation</td><td>Simple, well-known needs</td><td>Follow-on events, responses carried over as drafts</td></tr>
<tr><td>BAFO</td><td>A final, sealed improvement from the shortlist</td><td>After clarification or negotiation rounds</td><td>As a routine extra round that bidders learn to anticipate</td><td>Follow-on RFQ/RFP event to the shortlist</td></tr>
<tr><td>E-auction</td><td>Live price discovery</td><td>Precise specification, enough qualified bidders, price decides (module 3.4)</td><td>Complex or intellectual services, few bidders, no BATNA</td><td>Auction event, stand-alone or after an RFx as pre-bidding phase</td></tr>
</tbody></table>
<h4>The sequence follows the route to market</h4>
<ul>
<li><strong>One supplier chosen by tender</strong> (cleaning, security): optional RFI, then RFP with weighted quality/price, site visits, clarification, negotiation or BAFO. An auction only among bidders above the quality threshold, and only if the preconditions in 3.4 hold.</li>
<li><strong>Panel of preferred suppliers</strong> (consulting, IT services, agencies): a framework RFP with rate card, then mini-competitions per assignment or a documented direct award.</li>
<li><strong>Sole or single source</strong> (incumbent software): usage analysis, benchmark, an RFI to alternatives to make the BATNA credible, negotiation rounds. Never an RFP for show, never an auction.</li>
<li><strong>Commoditised, well specified</strong> (office supplies, print volumes): RFQ, English reverse auction, then a catalogue.</li>
<li><strong>Strategic partnership</strong> (managed services): RFI, RFP, dialogue workshops, BAFO, the structure of the EU competitive procedure with negotiation without its legal constraints.</li>
</ul>
<h4>Timeline and pack</h4>
<p>Plan backwards from the notice deadline, not the expiry. Indicative durations from practice: an RFI 2–3 weeks; an RFP response window of 3–6 weeks for services; at least 10 working days for a simple mini-competition (the UK CCS consultancy framework minimum, a useful reference). These are rules of thumb, not norms. Add evaluation, negotiation, approvals, contract and mobilisation (three months is not unusual for a cleaning transition with staff transfer).</p>
<div class="callout"><strong>Attach the draft contract.</strong> The RFx pack contains instructions, specification, pricing schedule, questionnaire, evaluation criteria and weights, timetable, <em>the draft contract with SLAs</em> and the regulatory annexes (DORA Art. 30 clauses for ICT services; Solvency II Art. 274 terms for critical or important outsourcing). With the contract in the pack, suppliers bid on your terms and deviations become part of the evaluation. Without it, you negotiate the terms after award, when your leverage has gone.</div>`,
      exercise: {
        id: "s3-ex1", title: "Practice 3.1: event sequence and timeline for your project", minutes: 15,
        brief: "Start from your strategy paper. Choose the event sequence and plan it backwards from the notice deadline.",
        fields: [
          { key: "route", type: "select", label: "Route to market from your strategy paper", options: ["One supplier chosen by tender", "Panel / framework with call-offs", "Sole or single-source negotiation", "RFQ and e-auction, then catalogue", "Strategic partnership (multi-stage)", "Mini-competition under an existing framework"] },
          { key: "deadline", type: "text", label: "Notice deadline (not expiry date) and contract start" },
          { key: "seq", type: "rows", label: "Event sequence", minRows: 4,
            columns: [
              { key: "stage", label: "Stage", type: "text" },
              { key: "tool", label: "Tool", type: "select", options: ["RFI", "RFP", "RFQ", "Spot Buy", "Site visits / presentations", "Negotiation round", "BAFO", "E-auction", "Mini-competition", "Direct award with benchmark"] },
              { key: "start", label: "Start (week or month)", type: "text" },
              { key: "dur", label: "Duration", type: "text" },
              { key: "out", label: "Output / decision", type: "text" }
            ] },
          { key: "pack", type: "checks", label: "RFx pack: what yours will contain", items: ["Instructions and timetable", "Specification (input, output or hybrid)", "Pricing schedule", "Questionnaire with knock-out questions", "Evaluation criteria and weights", "Draft contract with SLAs and KPIs", "Regulatory annex (DORA / outsourcing / data protection)", "Staff transfer data (labour-intensive services)"] },
          { key: "why", type: "textarea", label: "Why this sequence, in two sentences a business owner would accept" }
        ]
      }
    },
    {
      id: "3.2", title: "Designing the request", minutes: 40,
      lesson: `
<p class="lead">Van Weele's point applies here more than anywhere: decisions made early lock in most of the cost and risk. The request decides what you can compare, and therefore what you can award.</p>
<h4>Specification</h4>
<p><strong>Input</strong> specifications (frequencies, hours, headcount) are easy to audit but stifle innovation. <strong>Output</strong> specifications describe results and let suppliers propose methods, but are harder to draft and assess. A <strong>hybrid</strong> is common: outputs for most areas, prescribed methods where the client needs control, such as security procedures (CMS, 2000). Singapore's outcome-based cleaning guide shows the shift from specifying headcount to specifying results, with inspection templates.</p>
<h4>Lots</h4>
<p>Design lots the way you intend to award. In Coupa, items in a lot are always awarded together and ranked together, so one lot per site, country or service is a commercial decision, not a formatting one. If bundles could be cheaper (three cleaning sites together), let suppliers express it: bids per lot plus a bundle discount, or Coupa Sourcing Optimization for package bids.</p>
<h4>Pricing schedule</h4>
<ul>
<li>One template for all bidders, with your volumes and assumptions filled in.</li>
<li>Separate recurring prices from one-off costs (mobilisation, transition) and from unit rates for variations.</li>
<li>Ask for the indexation mechanism (for example a wage index for cleaning) as part of the bid.</li>
<li>Evaluate on total cost over the term (Ellram's TCO: pre-transaction, transaction and post-transaction costs), not on the first-year price.</li>
</ul>
<h4>Knock-out criteria and weighted criteria</h4>
<p>Pass/fail gates are not weighted: licences and vetting for security, a declaration of collective-wage compliance for cleaning, ISO 27001 or equivalent for ICT, acceptance of audit and access rights where DORA Art. 30 or Solvency II Art. 274 apply. Weighted criteria are the ones that differentiate: the service plan, staffing model, KPIs and reporting, transition, ESG, and price.</p>
<h4>The evaluation model, fixed before issue</h4>
<table class="tbl"><thead><tr><th>Score</th><th>Descriptor (example scale)</th></tr></thead><tbody>
<tr><td>5</td><td>Excellent: fully meets the requirement with evidence, adds value beyond it</td></tr>
<tr><td>4</td><td>Good: fully meets the requirement with evidence</td></tr>
<tr><td>3</td><td>Acceptable: meets the requirement, minor gaps or limited evidence</td></tr>
<tr><td>2</td><td>Weak: partially meets it, significant gaps</td></tr>
<tr><td>1</td><td>Poor: barely addresses it</td></tr>
<tr><td>0</td><td>No answer or does not meet it</td></tr>
</tbody></table>
<p>Weights reflect the category. As reference points, the UK CCS consultancy framework requires quality of at least 50% in further competitions, and a 2024 UK university cleaning tender was awarded 50/50 quality/price. Quality-led services typically sit at 50–70% quality. For a well-specified commodity, price (or a TCO formula) decides.</p>
<h4>Price scoring formulas</h4>
<ul>
<li><strong>Relative to lowest:</strong> price score = lowest price / bid price × 100. Simple and common, but every score moves when the lowest bid changes, so one very low bid can reorder the others.</li>
<li><strong>Linear deviation:</strong> price score = 100 × (1 − (bid − lowest) / lowest), with a floor at 0. It punishes price gaps harder.</li>
</ul>
<div class="callout"><strong>Test the formula before you publish it.</strong> Run three fictional bid sets through the model. If the ranking flips with the formula or with a small weight change, the model is deciding, not the bids. You will see it happen with the Nordvia cleaning bids in 3.3.</div>`,
      exercise: {
        id: "s3-ex2", title: "Practice 3.2: your weighted evaluation model", minutes: 20,
        brief: "Build the evaluation model for your project. Weights must add up to 100% and be fixed before issue.",
        fields: [
          { key: "spec", type: "select", label: "Specification type", options: ["Input", "Output", "Hybrid"] },
          { key: "lots", type: "textarea", label: "Lot structure and why (how will you award?)" },
          { key: "split", type: "split", label: "Top-level weights (%)", parts: ["Quality", "Price / TCO"] },
          { key: "ko", type: "textarea", label: "Knock-out criteria (pass/fail), including regulatory gates" },
          { key: "crit", type: "rows", label: "Weighted quality criteria", minRows: 4,
            columns: [
              { key: "c", label: "Criterion", type: "text" },
              { key: "w", label: "Weight %", type: "number" },
              { key: "ev", label: "Evidence asked for", type: "text" }
            ] },
          { key: "formula", type: "select", label: "Price scoring formula", options: ["Relative to lowest (lowest / bid × 100)", "Linear deviation from lowest", "TCO over the term, then relative", "Price only (lowest compliant wins)"] },
          { key: "tco", type: "textarea", label: "TCO elements you will include beyond the annual price" }
        ]
      }
    },
    {
      id: "3.3", title: "Running it fairly: Q&A, evaluation, award decision", minutes: 40,
      lesson: `
<p class="lead">Fairness is not only an ethical duty. It is what keeps good suppliers bidding next time, and what lets you defend the award to an auditor, a supervisor or a losing incumbent.</p>
<h4>Supplier engagement and equal treatment</h4>
<ul>
<li>Same information, same time, same deadline for every bidder. All questions go through the Coupa Message Center; answers that matter to all are shared with all, anonymised.</li>
<li>No side channels, above all with the incumbent. Stakeholders are briefed on this before issue.</li>
<li>Clarifications explain a bid; they do not let a bidder change it. The CCS consultancy framework allows no negotiation after bids, only transparent clarification. In a private event you may plan negotiation rounds, but only if the RFx said so.</li>
</ul>
<h4>Evaluation</h4>
<ol>
<li>Compliance check and knock-out criteria.</li>
<li>Individual scoring by about three evaluators, without seeing prices (CCS guidance).</li>
<li>Consensus meeting: discuss gaps between scores, agree one score with a written rationale.</li>
<li>Commercial evaluation on the published formula and TCO basis.</li>
<li>Sensitivity test: would a reasonable change of weights or formula change the winner?</li>
<li>Due diligence on the preferred bidders, then the evaluation report and award recommendation.</li>
</ol>
<h4>Worked example: Nordvia HQ cleaning lot (fictional)</h4>
<p>Annual price in thousand euros; quality 0–100 after consensus; price score = lowest price / bid price × 100.</p>
<table class="tbl"><thead><tr><th>Bidder</th><th>Price</th><th>Quality</th><th>Price score (all bids)</th><th>Total 50/50</th><th>Total 60/40</th></tr></thead><tbody>
<tr><td>A (incumbent)</td><td>690</td><td>62</td><td>75.4</td><td>68.7</td><td>67.3</td></tr>
<tr><td>B</td><td>610</td><td>74</td><td>85.2</td><td>79.6</td><td>78.5</td></tr>
<tr><td>C</td><td>520</td><td>58</td><td>100.0</td><td>79.0</td><td>74.8</td></tr>
<tr><td>D</td><td>655</td><td>81</td><td>79.4</td><td>80.2</td><td>80.4</td></tr>
</tbody></table>
<p>At 50/50, D, B and C sit within 1.2 points of each other. At 60/40, D leads more clearly. But look at C: its price is 15% below the next bid and about 20% below the average of the other three, and its staffing hours look below the wage floor. That is a potentially <strong>abnormally low bid</strong>. Ask C in writing to explain its hours and price, compare the answer with a should-cost model (hours × collectively agreed wage plus on-costs, supervision, consumables, overhead and margin), and record the decision. If C is excluded, the lowest price becomes 610 and every price score moves: D 87.1 against B 87.0 at 50/50; D 85.9 against B 84.4 at 60/40. A relative formula lets one bid reshape the contest.</p>
<div class="callout"><strong>What the numbers tell you.</strong> The model does not produce a clear winner between B and D at 50/50. That is a finding, not a failure: it tells you to clarify, negotiate or ask for a BAFO with both, and to deal with D's request for a four-year term against the published 3 + 1 + 1 structure. Never adjust weights after opening to break a tie.</div>
<h4>Due diligence before award</h4>
<p>Financial standing, references, information security, ESG and labour compliance. For ICT services, the DORA Art. 28(4) pre-contract assessment: does the service support a critical or important function, are all risks identified (including concentration risk), due diligence on the provider, conflicts of interest. For critical or important outsourcing, Solvency II (Delegated Regulation 2015/35 Art. 274) requires a detailed examination of the provider's ability, capacity and any required authorisation. These are gates, not weighted points.</p>`,
      exercise: {
        id: "s3-ex3", title: "Practice 3.3: evaluate the Nordvia cleaning bids", minutes: 20,
        brief: "Use the table in the lesson (annual price €K, quality 0–100). Price score = lowest price / bid price × 100. Round to one decimal.",
        fields: [
          { key: "q1", type: "check", label: "Price score of Bidder B, with all four bids", answer: 85.2, tol: 0.15, hint: "520 / 610 × 100." },
          { key: "q2", type: "check", label: "Total score of Bidder D at 50/50, with all four bids", answer: 80.2, tol: 0.15, hint: "0.5 × 81 + 0.5 × (520 / 655 × 100)." },
          { key: "q3", type: "check", label: "Total score of Bidder D at 60/40 quality/price, with all four bids", answer: 80.4, tol: 0.15, hint: "0.6 × 81 + 0.4 × 79.4." },
          { key: "q4", type: "check", label: "Total score of Bidder B at 50/50 if Bidder C is excluded", answer: 87.0, tol: 0.15, hint: "The lowest price is now 610, so B's price score is 100." },
          { key: "alb", type: "select", label: "Which bid do you treat as potentially abnormally low?", options: ["Bidder A", "Bidder B", "Bidder C", "Bidder D", "None"] },
          { key: "albAction", type: "textarea", label: "What you will ask that bidder, and what evidence would make you accept or reject the bid" },
          { key: "sens", type: "textarea", label: "What does the sensitivity test (50/50 vs 60/40, with and without C) tell you about the decision?" }
        ]
      }
    },
    {
      id: "3.4", title: "E-auctions: when they work and when they hurt", minutes: 35,
      lesson: `
<p class="lead">An e-auction automates distributive bargaining: real-time feedback replaces haggling. Used where it fits, it discovers the market price fast. Used where it does not, it buys a low price and a bad contract.</p>
<h4>Formats (Coupa definitions where Coupa documents them)</h4>
<table class="tbl"><thead><tr><th>Format</th><th>Mechanics</th><th>Best for</th><th>Watch out</th></tr></thead><tbody>
<tr><td>English reverse</td><td>Suppliers bid down; lowest wins at close. Coupa rules prevent price increases and very small improvements; feedback as rank or as difference to best bid</td><td>Leverage categories, 4+ qualified suppliers, fixed specification</td><td>Visible price wars damage trust; show rank rather than price</td></tr>
<tr><td>Dutch reverse (Coupa)</td><td>Buyer-controlled clock: the price starts low and rises by a pre-set amount; the first supplier to accept wins; bidding on total cost, all items awarded together</td><td>Speed and certainty, simple bundles, testing the market floor</td><td>Needs a well-researched start price; the first acceptor may leave money on the table</td></tr>
<tr><td>Reverse Japanese</td><td>Start above the expected price; suppliers must accept each step down; the last active bidder wins</td><td>Incumbent-heavy markets; suppliers who fear open bidding</td><td>Exit points are revealed; tacit coordination in concentrated markets</td></tr>
<tr><td>Sealed bid</td><td>One blind bid each, opened together: the classic tender</td><td>Relationships that must survive; few bidders</td><td>No live price discovery</td></tr>
<tr><td>Multi-attribute</td><td>A formula re-ranks price and quantified attributes live</td><td>When quality is scored first and only price moves</td><td>Not clearly documented in core Coupa Sourcing: confirm in your tenant</td></tr>
</tbody></table>
<h4>The preconditions checklist</h4>
<ol>
<li>Precise specification; bids can be ranked automatically (EU Directive 2014/24 Art. 35 as the reference test).</li>
<li>At least four to five qualified, interested bidders (Smeltzer &amp; Carr 2003).</li>
<li>A fragmented market with spare capacity and an attractive account (Smeltzer &amp; Carr; Jap 2007).</li>
<li>Price, or a published formula, decides; non-price elements evaluated before the auction.</li>
<li>Low switching cost, and a post-award relationship that tolerates it (Jap).</li>
<li>A credible BATNA and a real intention to award as announced.</li>
</ol>
<h4>The evidence</h4>
<ul>
<li>Typical claimed price reductions: 5–15% (Jap 2002; Smeltzer &amp; Carr 2003, via Mora Cortez et al. 2023). A range, not a promise.</li>
<li>Realised savings are lower than reported by auction service providers (Emiliani &amp; Stec 2002).</li>
<li>Open-bid auctions raise supplier suspicion more than sealed bids, with no difference in buyer savings (Jap 2003, 2007).</li>
<li>Auctions perform poorly for complex work with incomplete contracts and few bidders, and stifle the communication needed to use supplier expertise (Bajari, McMillan &amp; Tadelis 2009).</li>
<li>In the US federal government, over one-third of reverse auctions in FY2012 had no interactive bidding (GAO-14-108): an auction with one bidder is an expensive RFQ.</li>
<li>Best-case public examples (the UK CCS aggregated IT hardware for 34 councils with savings of about 36%) are aggregated commodities. Do not transfer those percentages to services.</li>
</ul>
<div class="callout"><strong>Rules and ethics.</strong> Publish the rules in advance: start or reserve price, decrement, closing and extension rules, feedback, lots, and whether the best bid is guaranteed to win. Offer a mock auction. No phantom bidders, no auction as a bluff, no renegotiation after the auction. Never run a price-only auction for cleaning or security without a quality threshold and a should-cost floor: bids can fall below sustainable wages.</div>`,
      exercise: {
        id: "s3-ex4", title: "Practice 3.4: auction suitability check", minutes: 15,
        brief: "Check four Nordvia categories and your own project against the preconditions. Choose a format or say no.",
        fields: [
          { key: "check", type: "rows", label: "Suitability check", minRows: 5, preset: ["P5 Office supplies and print", "P1 Office cleaning", "P7 Creative agencies", "P4 Network and telecom (Telmo)", "My project"],
            columns: [
              { key: "cat", label: "Category", type: "text" },
              { key: "spec", label: "Precise spec?", type: "select", options: ["Yes", "Partly", "No"] },
              { key: "bidders", label: "Qualified bidders", type: "number" },
              { key: "price", label: "Price decides?", type: "select", options: ["Yes", "After quality threshold", "No"] },
              { key: "rel", label: "Relationship tolerates it?", type: "select", options: ["Yes", "With care", "No"] },
              { key: "verdict", label: "Verdict", type: "select", options: ["English reverse", "Reverse Japanese", "Dutch reverse (Coupa)", "Sealed bid / BAFO", "No auction: RFP and negotiation", "No auction: negotiation"] }
            ] },
          { key: "rules", type: "textarea", label: "If you chose an auction for your project: the rules you will publish (feedback, closing, award rule)" }
        ]
      }
    },
    {
      id: "3.5", title: "Coupa Sourcing in practice", minutes: 30,
      lesson: `
<p class="lead">Coupa is where the event lives: invitations, Q&A, bids, scoring, award and the audit trail. Use what Coupa documents with confidence, and confirm the rest in your own tenant before you promise it to suppliers or stakeholders.</p>
<h4>What Coupa documents publicly</h4>
<table class="tbl"><thead><tr><th>Area</th><th>What it does</th></tr></thead><tbody>
<tr><td>Event types</td><td>Spot Buy (urgent or short-term, no contract); RFI (qualitative, forms and attachments); RFQ (prices for items and lots); RFP (prices plus information); auctions stand-alone or after an RFx as a pre-bidding phase</td></tr>
<tr><td>Auctions</td><td>English reverse, Dutch reverse (low start, rising clock), reverse Japanese</td></tr>
<tr><td>Pre-bidding phase</td><td>Suppliers update their submission without limit, bidding rules do not apply, submissions are collected without feedback</td></tr>
<tr><td>Privacy</td><td>Public, Private (invited suppliers only), Hidden (specific supplier users)</td></tr>
<tr><td>Lots and items</td><td>Items in a lot are always awarded together; partial participation where configured; Excel import and export of responses</td></tr>
<tr><td>Feedback</td><td>Rank or difference to best bid, at the buyer's choice; lots and total cost ranked</td></tr>
<tr><td>Supplier side</td><td>Terms accepted before access; several questionnaires; Message Center for Q&A with email notifications; follow-on events with responses carried over; the Coupa Supplier Portal</td></tr>
<tr><td>Sourcing Optimization</td><td>Ex-Trade Extensions (acquired 2017): package and bundle bidding, constraints, what-if scenarios, several rounds, award to contracts and catalogues (vendor description)</td></tr>
<tr><td>After award</td><td>Contract in CLM (workflow, clause library, approvals, alerts), supplier onboarding in SIM (InfoSec, DORA and ESG questionnaires), catalogue and contract-backed buying</td></tr>
</tbody></table>
<h4>Confirm in your Coupa tenant</h4>
<ul>
<li>Overtime or soft-close extensions and minimum decrement parameters for auctions.</li>
<li>A formal sealed-envelope setting (technical and commercial bids opened separately at a set date).</li>
<li>Multi-attribute live auctions in core Coupa Sourcing.</li>
<li>How weighted scoring is configured in core Sourcing, and who sees which scores. If in doubt, run the published model in the evaluation template and attach it to the event.</li>
</ul>
<h4>Good practice</h4>
<ul>
<li>Start from approved templates per route to market: tender for soft FM, mini-competition for panels, RFQ plus auction for commodities.</li>
<li>Put the draft contract and the weights in the event, not in an email.</li>
<li>Keep every clarification in the Message Center: it is your audit trail and your equal-treatment evidence.</li>
<li>Use Sourcing Optimization when lots interact: several cleaning sites, telecom lines, hotel programmes.</li>
<li>Close the loop: award, contract in CLM, catalogue or contract-backed buying, so that people actually buy against the new terms.</li>
</ul>`,
      exercise: {
        id: "s3-ex5", title: "Practice 3.5: your Coupa event set-up sheet", minutes: 15,
        brief: "Write the set-up sheet a colleague could use to build your event in Coupa. Mark what you must confirm in your tenant.",
        fields: [
          { key: "setup", type: "pairs", label: "Event set-up", items: ["Event type(s) and sequence", "Privacy and invited suppliers", "Lots and items", "Questionnaires and knock-out questions", "Attachments (spec, draft contract, annexes)", "Pre-bidding phase and timeline", "Auction format, feedback and closing (if any)", "Scoring set-up and who sees prices", "Message Center rules", "Award, CLM and catalogue handover"] },
          { key: "confirm", type: "textarea", label: "Settings to confirm in your Coupa tenant before issue" }
        ]
      }
    }
  ],
  case: {
    title: "Case 3: the HQ cleaning lot, end to end",
    body: `
<p class="lead">Nordvia's office cleaning (P1: €2.4M, 3 sites in 2 countries) has been rolled over since 2019, with quality complaints at HQ. Following the Session 2 strategy, Procurement ran an RFP with a hybrid specification, a 3 + 1 + 1 term and a published 50/50 quality/price model. Four bids arrived for the HQ lot.</p>
<table class="tbl"><thead><tr><th>Bidder</th><th>Annual price €K</th><th>Quality 0–100</th><th>Note</th></tr></thead><tbody>
<tr><td>A (incumbent)</td><td>690</td><td>62</td><td>Same method as today; staff continuity</td></tr>
<tr><td>B</td><td>610</td><td>74</td><td>Output-based plan, robot floor care at night</td></tr>
<tr><td>C</td><td>520</td><td>58</td><td>Price far below the others; staffing hours look below the wage floor</td></tr>
<tr><td>D</td><td>655</td><td>81</td><td>Strongest quality and ESG plan; requires a 4-year term</td></tr>
</tbody></table>
<p class="muted small">Fictional bids. Quality scored by three evaluators after consensus.</p>
<p>The Head of Real Estate wants a decision this month. Prepare the team's answer: how you handle C, whom you negotiate with, whether an auction makes sense, how you treat D's term condition, and your award recommendation subject to due diligence.</p>
<details class="hidden-facts teacher-only"><summary>Teacher notes for the debrief</summary>
<ol>
<li>C: ask for a written explanation of hours and price against the collective wage; if not convincing, reject as abnormally low and record why. C would also fail a quality threshold of 60 if one had been published: a design lesson for next time.</li>
<li>No auction: after C, only two strong bidders (B, D) and a weak incumbent; labour-intensive service; fewer than four to five qualified bidders.</li>
<li>Negotiate or BAFO with B and D only, on the published model. D's 4-year term is a deviation: ask D to price the compliant 3 + 1 + 1 term; do not change the structure for one bidder.</li>
<li>Sensitivity: without C, D leads at 50/50 (by 0.1 point) and at 60/40; B leads at 40/60 or with a linear price formula. The recommendation must say the decision is close.</li>
</ol></details>`,
    exercise: {
      id: "s3-case", title: "Case 3 team answer", minutes: 25,
      brief: "Your team's recommendation to the Head of Real Estate, on one screen.",
      fields: [
        { key: "c", type: "textarea", label: "How you handle Bidder C" },
        { key: "who", type: "select", label: "Negotiate (or BAFO) with", options: ["B and D", "B, C and D", "All four", "D only", "B only"] },
        { key: "auction", type: "select", label: "Auction?", options: ["No auction", "English reverse auction among B and D", "Reverse Japanese auction among all four", "Dutch reverse auction"] },
        { key: "term", type: "text", label: "How you treat D's 4-year term condition" },
        { key: "award", type: "textarea", label: "Award recommendation and conditions (due diligence, sensitivity, mobilisation)" }
      ]
    }
  },
  fieldwork: {
    title: "Fieldwork 3 (before Session 4)",
    items: [
      { id: "s3-fw-1", text: "Build the RFx pack outline for your project: instructions, specification type, lots, pricing schedule, questionnaire, draft contract, regulatory annexes." },
      { id: "s3-fw-2", text: "Validate the evaluation model and weights with the business owner before issue, and record the agreement." },
      { id: "s3-fw-3", text: "Run three fictional bid sets through your model to test the price formula and the sensitivity of the weights." },
      { id: "s3-fw-4", text: "Confirm with your Coupa administrator the settings you flagged in Practice 3.5 (scoring, sealed opening, auction extensions)." },
      { id: "s3-fw-5", text: "If your project involves ICT services or a critical or important function, agree the DORA / outsourcing gate criteria with Risk or Compliance." }
    ],
    guide: `<p>Ask the business owner to commit to the weights <em>before</em> any bid is seen: "If the bids come in close, these weights decide. Are you comfortable with that?" Show the test bid sets: a business owner who sees the model reverse a ranking understands why the weights matter. Write the agreed model into the Coupa event so that it cannot drift.</p>`,
    exercise: {
      id: "s3-fw", title: "Weights validated with the business owner", minutes: 0, brief: "Bring this to Session 4.",
      fields: [
        { key: "weights", type: "rows", label: "Agreed evaluation model", minRows: 4, columns: [ { key: "c", label: "Criterion", type: "text" }, { key: "w", label: "Weight %", type: "number" }, { key: "chg", label: "Changed after the conversation?", type: "select", options: ["No", "Yes"] } ] },
        { key: "owner", type: "textarea", label: "What the business owner pushed back on, and what you agreed" },
        { key: "test", type: "textarea", label: "Result of the three test bid sets: did any ranking flip?" }
      ]
    }
  },
  slides: [
    { kind: "title", h: "HOW do we run the event?", sub: "Session 3 · RFx, evaluation and e-auctions in Coupa" },
    { kind: "poll", poll: "s3-p1", h: "Strategy paper check-in" },
    { h: "The tool follows the strategy", bullets: ["Category and power position first", "Sourcing strategy second", "Event design third: RFI, RFP, RFQ, BAFO, auction"] },
    { h: "Design the request", bullets: ["Specification: input, output or hybrid", "Lots the way you will award", "One pricing schedule, TCO over the term", "Weights and formula fixed before issue"] },
    { h: "Nordvia HQ cleaning (fictional)", table: [["Bidder", "Total 50/50", "Total 60/40"], ["D", "80.2", "80.4"], ["B", "79.6", "78.5"], ["C", "79.0", "74.8"], ["A", "68.7", "67.3"]] },
    { kind: "poll", poll: "s3-p2", h: "Cleaning: auction or not?" },
    { h: "Auction preconditions", bullets: ["Precise specification", "Four to five qualified bidders", "Price or a formula decides", "Low switching cost, relationship tolerates it", "Credible BATNA and intent to award"] },
    { h: "Coupa auction formats", bullets: ["English reverse: bid down, lowest wins", "Dutch reverse: price starts low and rises; first to accept wins", "Reverse Japanese: accept each step; last active wins"] },
    { kind: "poll", poll: "s3-p3", h: "Your weakest link" },
    { h: "Before Session 4", bullets: ["RFx pack outline", "Weights validated with the business owner", "Three test bid sets", "Tenant settings confirmed"] }
  ],
  polls: [
    { id: "s3-p1", q: "What did the business owner change in your strategy paper?", options: ["Nothing: approved as written", "The number of suppliers", "The term or the contract model", "The scope or the need itself", "I have not met them yet"] },
    { id: "s3-p2", q: "Nordvia HQ cleaning: after the RFP, should we run an e-auction?", options: ["Yes, English reverse among all four", "Yes, among the bidders above a quality threshold", "No: negotiate or BAFO with the best two", "No: award to the highest score now"] },
    { id: "s3-p3", q: "Where are your team's events weakest today?", options: ["Weights fixed too late", "No draft contract in the pack", "Bids not comparable", "Too few real bidders", "Coupa used only as a mailbox"] }
  ],
  facilitator: `
<ul>
<li><b>Thread of the session.</b> Repeat at every module: the tool follows the strategy. Ask each participant to state their route to market before they design anything.</li>
<li><b>3.1.</b> Use the pre-work audit of an old RFx: count in the room how many events had a draft contract attached and weights fixed before issue. The numbers are usually low and make the point for you.</li>
<li><b>3.2.</b> In Practice 3.2, ask participants to state whether the quality sub-criterion weights add up to the quality weight or to 100% of quality; both are acceptable if stated.</li>
<li><b>3.3 expected answers</b> (price score = lowest / bid × 100): price scores A 75.4, B 85.2, C 100.0, D 79.4. Totals 50/50: D 80.2, B 79.6, C 79.0, A 68.7. Totals 60/40: D 80.4, B 78.5, C 74.8, A 67.3. Without C at 50/50: D 87.1, B 87.0, A 75.2; at 60/40: D 85.9, B 84.4. At 40/60 with all bids, C would rank first (83.2), which shows why abnormally low bids and quality thresholds matter. With the linear formula at 50/50 and all bids, C ranks first (79.0) and B overtakes D (78.3 vs 77.5); without C, B leads 87.0 vs 86.8. C is about 15% below the next bid and about 20% below the average of the others.</li>
<li><b>3.4 expected verdicts.</b> Office supplies and print: English reverse after an RFQ, then a catalogue. Cleaning: no price-only auction; RFP plus negotiation or BAFO. Creative agencies: no auction (intellectual services; EU Art. 35 logic). Telmo network: possible on standardised tariffs only if four or more qualified providers and the DORA assessment is done; otherwise RFP and negotiation. Expect debate on Telmo: that is the purpose.</li>
<li><b>3.5 and Coupa.</b> Do not state tenant settings as facts. Overtime, decrements, sealed envelopes, multi-attribute auctions and core weighted scoring are to be confirmed with the Coupa administrator. Coupa's Dutch reverse auction rises from a low start: correct anyone who describes it as falling.</li>
<li><b>Case.</b> Teams often want to auction B and D. Push back with the preconditions: two bidders, labour-intensive service, relationship needed. The strong answer is clarification of C, BAFO with B and D on the published model, D asked to price the compliant term, a recommendation that says the decision is close.</li>
</ul>`
});
