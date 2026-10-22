// Procurement Academy catalogue. "open" courses have their own folder; the others show as coming soon.
// Texts can be changed by the admin on the home page (Edit the catalogue); the course folders stay fixed.
window.ACADEMY = {
  name: "Procurement Academy",
  heroEyebrow: "Indirect Procurement · Learning platform",
  heroTitle: "Building the Procurement team the business wants to call first",
  heroLead: "Practical, online programmes for indirect Procurement: live classes with your teacher, narrated video lessons, real exercises and ready-to-use templates.",
  courses: [
    { id: "stakeholder", ns: "", path: "stakeholder/", status: "open", code: "Course 1", color: "#B3122A",
      title: "Stakeholder Academy", subtitle: "Stakeholder Management for Indirect Procurement",
      desc: "Move from reactive buyer to trusted business partner: prioritise stakeholders, turn spend data into insight, build a Procurement Action Plan and agree it with your internal clients.",
      facts: ["4 live sessions", "24 video lessons", "27 templates"] },
    { id: "source-to-contract", ns: "s2c", path: "source-to-contract/", status: "open", code: "Course 2", color: "#0F7C8C",
      title: "Source to Contract", subtitle: "Sourcing strategies, RFx, e-negotiation and contracting",
      desc: "Choose the right strategy for each situation (single supplier by tender, preferred-supplier panel, sole-source negotiation) and run it end to end with the right tool: RFI, RFP, RFQ, e-auction and contract.",
      facts: ["4 live sessions", "24 video lessons", "Coupa in practice"] },
    { id: "category-management", status: "soon", code: "Coming soon", color: "#6E6A4F", title: "Category Management", subtitle: "Category strategies for indirect spend", desc: "Build multi-year category strategies with your stakeholders, from market analysis to the implementation roadmap.", facts: [] },
    { id: "negotiation", status: "soon", code: "Coming soon", color: "#34507A", title: "Negotiation for Procurement", subtitle: "Preparation, tactics and e-negotiation", desc: "Prepare and lead negotiations with confidence: BATNA, concession planning, difficult suppliers and online events.", facts: [] },
    { id: "srm", status: "soon", code: "Coming soon", color: "#5B6575", title: "Supplier Relationship Management", subtitle: "Performance, risk and value from key suppliers", desc: "Segment suppliers, run performance reviews and manage third-party risk, including the regulatory requirements of an insurer.", facts: [] }
  ]
};
// The admin's saved texts ("Edit the catalogue") are applied on top of these defaults, for visitors and signed-in people alike.
window.ACADEMY_ORIG = JSON.parse(JSON.stringify(window.ACADEMY));
window.ACADEMY_APPLY = function (o) {
  const A = window.ACADEMY;
  Object.assign(A, JSON.parse(JSON.stringify(window.ACADEMY_ORIG)));
  if (!o) return;
  ["name", "heroEyebrow", "heroTitle", "heroLead"].forEach(k => { if (o[k]) A[k] = o[k]; });
  (o.courses || []).forEach(x => { const c = A.courses.find(y => y.id === x.id); if (c) ["title", "subtitle", "desc", "facts", "status"].forEach(k => { if (x[k] != null) c[k] = k === "status" && !c.path ? c.status : x[k]; }); });
};
