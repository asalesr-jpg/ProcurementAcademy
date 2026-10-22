/* Source to Contract course: anonymised Group context and the fictional Nordvia case.
   Entity names, supplier names and exact amounts are disguised: figures are rounded and perturbed. */
window.COURSE = window.COURSE || { sessions: [] };
window.COURSE.meta = { id: "source-to-contract", title: "Source to Contract", subtitle: "Sourcing strategies, RFx, e-negotiation and contracting for Indirect Procurement" };
window.COURSE.site = {
  heroTitle: "The right strategy, the right tool, the right contract",
  heroLead: "Four live online sessions on how indirect Procurement chooses and runs the right route to market: tenders, preferred-supplier panels, sole-source negotiations and e-auctions in Coupa. You apply each step to one real sourcing project of your own.",
  fieldworkLine: "Between sessions you apply each step to one real sourcing project from your own pipeline.",
  workbookName: "Sourcing Case",
  preworkLine: "Pre-work: a short reading and a quiz, 40–45 minutes."
};
window.DATA = {
  group: {
    totalSpend: 1700, addressable: 318, entities: 10,
    categories: ["IT & Telecoms","BPO & Prof. Services","Facilities & Real Estate","Advertising & Comm.","Mobility & Events","Office Support","Other"],
    entities: [
      {entity:"Entity A",cats:[25.2,16.1,4.3,7.7,2.9,5.9,2.3],total:64.4,suppliers:700,tailPct:8},
      {entity:"Entity B",cats:[24.9,21.4,4.9,2.0,2.6,0.1,2.6],total:58.5,suppliers:670,tailPct:6},
      {entity:"Entity C",cats:[18.7,10.1,3.5,5.9,0.8,1.0,1.1],total:41.1,suppliers:550,tailPct:10},
      {entity:"Entity D",cats:[23.6,3.5,5.9,0.4,2.6,0.1,0.6],total:36.7,suppliers:290,tailPct:6},
      {entity:"Entity E",cats:[13.5,13.9,2.4,2.2,0.2,0.4,2.6],total:35.2,suppliers:450,tailPct:9},
      {entity:"Entity F",cats:[11.1,4.3,2.7,2.3,1.2,1.3,2.0],total:24.9,suppliers:1780,tailPct:30},
      {entity:"Entity G",cats:[6.2,5.3,2.6,3.8,1.6,2.4,1.4],total:23.3,suppliers:890,tailPct:19},
      {entity:"Entity H",cats:[7.5,3.0,1.4,1.7,1.6,1.6,0.1],total:16.9,suppliers:140,tailPct:10},
      {entity:"Entity I",cats:[3.8,2.7,1.5,0.6,0.4,0.4,1.4],total:10.8,suppliers:520,tailPct:26},
      {entity:"Entity J",cats:[0.4,2.3,2.4,0.0,0.6,0.8,0.0],total:6.5,suppliers:150,tailPct:9}
    ],
    sizeBands: [
      {band:"Below €50K", recordsPct:86, spendPct:12},
      {band:"€50K to €250K", recordsPct:10, spendPct:25},
      {band:"€250K to €1M", recordsPct:3, spendPct:34},
      {band:"Above €1M", recordsPct:1, spendPct:29}
    ],
    subcats: [
      {name:"IT services", spend:80, entities:10, suppliers:350, type:"Global / Local"},
      {name:"Consulting & audit", spend:49, entities:10, suppliers:360, type:"Global / Local"},
      {name:"IT software", spend:29, entities:10, suppliers:230, type:"Global"},
      {name:"Facility management", spend:22, entities:10, suppliers:350, type:"Local"},
      {name:"Media services", spend:9, entities:9, suppliers:110, type:"Global"},
      {name:"Call centre", spend:8, entities:3, suppliers:5, type:"Local"},
      {name:"Logistics & postal", spend:7, entities:9, suppliers:40, type:"Local"},
      {name:"IT hardware", spend:6, entities:10, suppliers:35, type:"Global"},
      {name:"Legal services", spend:6, entities:10, suppliers:70, type:"Local"},
      {name:"Events", spend:3, entities:10, suppliers:90, type:"Local"}
    ],
    facts: [
      ["About 23%","of total spend is addressable by Procurement; the rest is insurance-related direct spend, taxes and intercompany"],
      ["About 2/3","of addressable spend sits in 8 sub-categories that all ten entities buy"],
      ["~90 supplier groups","work for two or more entities: around €50M managed in some 360 separate local relationships"],
      ["About 2%","of the spend is covered by a Group contract today"],
      ["86% of records","are suppliers below €50K a year, but they carry only 12% of the spend"],
      ["~800 relationships","above €50K carry about 88% of the spend: the negotiable universe"],
      ["Over 90%","of the spend is with suppliers in the entity's own country"],
      ["~6% per cycle","is a reasonable planning assumption for procurement value: about 2% cost savings plus 4% cost avoidance over a 3-year contract cycle"]
    ],
    pipelineSources: [
      {source:"Expiring contracts", share:"60–70%", note:"Recurring spend: contract end dates tell us what is coming"},
      {source:"Business input", share:"15–30%", note:"New projects and one-shot needs, captured at fixed touchpoints with the areas"},
      {source:"Proactive initiatives", share:"15–30%", note:"Planned from spend analysis: panels, consolidations, category strategies"},
      {source:"Urgent and unplanned", share:"5–10%", note:"The exception, not the rule"}
    ],
    sharedExamples: [
      {what:"Advisory firms (\"Big Four\")", pattern:"About €12M in 9 entities through 60 separate supplier records, no Group agreement"},
      {what:"Software publishers and resellers", pattern:"Same publishers in up to 7 entities, only partly under Group contracts"},
      {what:"Fleet, travel and employee benefits", pattern:"Same service bought with different suppliers and price models in each entity"},
      {what:"IT services", pattern:"About 350 suppliers for €80M; only 5% of the spend with a supplier shared by two entities"}
    ],
    tenderFamilies: [
      {family:"IT & telecom", tenders:41, countries:9},
      {family:"Facilities & real estate", tenders:18, countries:7},
      {family:"Consulting, audit & legal", tenders:17, countries:7},
      {family:"People, travel & other services", tenders:16, countries:7},
      {family:"Marketing, media & print", tenders:12, countries:5}
    ]
  },
  nordvia: {
    profile: "Nordvia Insurance is a fictional mid-sized insurer with 4,200 employees in three countries, part of a European insurance group. Indirect spend: €186M a year, managed by a Procurement team of 9.",
    clients: [
      {area:"IT", head:"Maria Lenz, CIO", spend:82, suppliers:310, today:"Tenders for big projects only; licence renewals handled by IT"},
      {area:"Marketing", head:"Tom Akers, CMO", spend:34, suppliers:140, today:"Rarely; agencies chosen by the brand team"},
      {area:"Facilities", head:"Elena Ruiz, Head of Real Estate", spend:28, suppliers:95, today:"Contracts managed; renewals often urgent"},
      {area:"General Services", head:"Ana Costa, Head of General Services", spend:18, suppliers:210, today:"Purchase orders and catalogues"},
      {area:"Other (HR, Legal, Claims services)", head:"Several", spend:15, suppliers:380, today:"Ad hoc"},
      {area:"Communication", head:"Jonas Weber, Head of Corporate Comms", spend:9, suppliers:120, today:"Almost never; many small event suppliers"}
    ],
    itSuppliers: [
      {supplier:"Northbyte Services", service:"Infrastructure outsourcing", spend:19.4, contract:"Yes", expiry:"Dec 2027", note:"Critical ICT provider, in the DORA register"},
      {supplier:"Kelvar Software", service:"Core licences", spend:11.2, contract:"Yes", expiry:"Jun 2027", note:"9% uplift at the last renewal"},
      {supplier:"Orbis Workplace IT", service:"Devices and end-user support", spend:7.8, contract:"Yes", expiry:"Mar 2027", note:"A Group framework exists at lower rates"},
      {supplier:"Brightline Consulting", service:"IT consulting", spend:6.1, contract:"No", expiry:"n/a", note:"Day rates from 12 different call-offs"},
      {supplier:"Telmo Networks", service:"Network and telecom", spend:4.9, contract:"Yes", expiry:"Sep 2026 (extended)", note:"Rolled over twice without review"},
      {supplier:"305 other suppliers", service:"Various", spend:32.6, contract:"Partly", expiry:"Various", note:"140 suppliers below €10K"}
    ],
    marketing: [
      {service:"Media buying", spend:18.0, suppliers:"1 agency", fact:"Contract expired 8 months ago; the Group has a media framework in another country"},
      {service:"Creative agencies", spend:7.2, suppliers:"6 agencies", fact:"Overlapping briefs; no rate card"},
      {service:"Events", spend:3.9, suppliers:"22 suppliers", fact:"Bought separately by Marketing and Communication, partly the same suppliers"},
      {service:"Market research", spend:2.6, suppliers:"4 agencies", fact:"Two tracking studies measure almost the same thing"},
      {service:"Print and promotional items", spend:2.3, suppliers:"31 suppliers", fact:"No catalogue; many one-off orders"}
    ]
  }
,
  s2c: {
    team: "Nordvia's Procurement team of 9 runs about 60 sourcing events a year in Coupa. Until now most were RFQs with three quotes, whatever the category.",
    pipeline: [
      {id:"P1", category:"Office cleaning (3 sites, 2 countries)", owner:"Facilities", spend:2.4, suppliers:"3 local cleaners", expiry:"Jun 2027", today:"Three contracts rolled over since 2019; quality complaints at HQ"},
      {id:"P2", category:"IT consulting and project staff", owner:"IT", spend:6.1, suppliers:"12 firms, 38 call-offs", expiry:"No framework", today:"Day rates for the same senior profile range from 820 to 1,450 euros"},
      {id:"P3", category:"Core insurance software licences (Kelvar)", owner:"IT", spend:11.2, suppliers:"1 vendor", expiry:"Jun 2027", today:"9% uplift last time; no usage data; auto-renewal clause"},
      {id:"P4", category:"Network and telecom (Telmo)", owner:"IT", spend:4.9, suppliers:"1 provider", expiry:"Sep 2026 (extended)", today:"Rolled over twice; provides services used by claims systems"},
      {id:"P5", category:"Office supplies and print", owner:"General Services", spend:2.3, suppliers:"31 suppliers", expiry:"Various", today:"No catalogue; 1,900 purchase orders a year below 1,000 euros"},
      {id:"P6", category:"Security and reception", owner:"Facilities", spend:1.6, suppliers:"1 provider", expiry:"Dec 2027", today:"Hourly rates indexed twice in 2 years; no KPIs"},
      {id:"P7", category:"Creative agencies", owner:"Marketing", spend:7.2, suppliers:"6 agencies", expiry:"No framework", today:"Overlapping briefs, no rate card, every campaign briefed to a favourite"},
      {id:"P8", category:"Claims IT managed service (Northbyte)", owner:"IT", spend:19.4, suppliers:"1 provider", expiry:"Dec 2027", today:"Supports a critical function; in the DORA register; no tested exit plan"}
    ],
    cleaningBids: {
      note: "Fictional bids for the HQ cleaning lot (annual price in thousand euros; quality scored 0 to 100 by three evaluators after consensus).",
      weights: {quality:50, price:50},
      bids: [
        {bidder:"Bidder A (incumbent)", price:690, quality:62, note:"Same method as today; staff continuity"},
        {bidder:"Bidder B", price:610, quality:74, note:"Output-based plan, robot floor care at night"},
        {bidder:"Bidder C", price:520, quality:58, note:"Price 18% below the others; staffing hours look below the wage floor"},
        {bidder:"Bidder D", price:655, quality:81, note:"Strongest quality and ESG plan; requires 4-year term"}
      ]
    },
    consulting: {
      note: "Twelve months of IT consulting call-offs (fictional).",
      firms: 12, calloffs: 38, spend: 6.1, top3Share: 61, withoutCompetition: 29, rateRange: "820 to 1,450 euros a day for the same senior profile"
    },
    kelvar: {
      note: "Core insurance software renewal (fictional).",
      annual: 11.2, uplift: 9, renewal: "Jun 2027", noticeMonths: 9, shelfware: "an estimated 20 to 25 percent of named-user licences unused", alternatives: "two credible platforms, migration of 18 to 24 months"
    }
  }
};
