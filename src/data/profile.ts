import { Profile, KPI, Organization, Education, Skill, CaseStudy } from '../types';

export const profile: Profile = {
  name: "Prateek Kiran",
  title: "Product Leader • AI & LLM Innovator • Builder of Agentic Workflows",
  email: "prateekkiran@gmail.com",
  location: "Gurugram, India",
  tagline: "Product Leader • AI & LLM Innovator • Builder of Agentic Workflows",
  subline: "I scale products and teams—blending strategy, AI, and execution to turn bold ideas into market results.",
  links: {
    linkedin: "https://linkedin.com/in/prateekkiran"
  }
};

export const kpis: KPI[] = [
  { 
    label: "Years in Product Leadership", 
    value: 10, 
    suffix: "+",
    description: "Decade of transforming vision into market outcomes"
  },
  { 
    label: "Programs Overseen", 
    value: 390, 
    suffix: "M+",
    description: "Large-scale modernization and transformation programs"
  },
  { 
    label: "Cycle Time Reduction", 
    value: 35, 
    suffix: "%",
    description: "Via LLM-powered features and automation"
  },
  { 
    label: "Regulatory Adherence", 
    value: 100, 
    suffix: "%",
    description: "Compliance maintained at scale across 50+ providers"
  }
];

export const filters = [
  "AI & LLM", 
  "Product Strategy", 
  "GTM", 
  "Agile Leadership", 
  "Data/Analytics", 
  "Compliance"
];

const caseStudies: { [key: string]: CaseStudy } = {
  "llm-therapy": {
    title: "LLM-Powered Therapy Analytics",
    problem: "Manual session reviews slowed operations and insights generation, creating bottlenecks in the therapeutic workflow.",
    approach: "Embedded LLM features to automatically summarize, tag, and flag events. Built agentic multi-step workflows to streamline operations.",
    outcome: "35% reduction in review time with improved release cadence and better insights quality.",
    stack: ["LLM Integration", "Prompt Engineering", "Agentic Workflows", "PDLC Re-design"],
    impact: ["35% faster review cycles", "Improved release velocity", "Enhanced insight accuracy"]
  },
  "evv-compliance": {
    title: "EVV Compliance at Scale",
    problem: "Multi-state regulatory complexity created compliance burdens for healthcare providers across different jurisdictions.",
    approach: "Expanded EVV capabilities across core PMS, standardized data collection, and built comprehensive compliance dashboards.",
    outcome: "100% adherence for 50+ providers with 10% increase in post-launch engagement.",
    stack: ["Data Pipelines", "Rules Engines", "Compliance Dashboards", "Regulatory Standards"],
    impact: ["100% compliance maintained", "50+ providers supported", "+10% engagement"]
  },
  "data-modernization": {
    title: "Data Modernization Program",
    problem: "Fragmented data across 7 sources with rising infrastructure costs and limited scalability.",
    approach: "Cloud-first roadmap with comprehensive data lineage mapping and proof-of-concepts for modernization.",
    outcome: "$100k cost savings with 40% productivity gains, foundation for $390M+ programs.",
    stack: ["Cloud Migration", "Data Lineage", "Vendor Orchestration", "Cost Optimization"],
    impact: ["$100k cost savings", "40% productivity gains", "$390M+ program foundation"]
  },
  "vendor-automation": {
    title: "Vendor Process Automation",
    problem: "Manual vendor management processes across 75 vendors with $130M+ ACV created operational inefficiencies.",
    approach: "Automated PO approvals and streamlined vendor negotiations with systematic process improvements.",
    outcome: "$1.3M savings with 90% reduction in manual effort for purchase order processing.",
    stack: ["Process Automation", "Vendor Management", "Contract Optimization", "Workflow Tools"],
    impact: ["$1.3M vendor savings", "307 contracts managed", "90% effort reduction"]
  }
};

export const timeline: Organization[] = [
  {
    org: "Aloha ABA",
    location: "Gurugram, India",
    roles: [
      {
        title: "Senior Product Manager",
        start: "2025-04",
        end: "Present",
        tags: ["AI & LLM", "Product Strategy", "Agile Leadership"],
        highlights: [
          "Own vision & roadmap for end-to-end behavioral data collection platform (ABA)",
          "Integrated LLM features automating therapy-session insights → 35% less manual review",
          "Designed agentic workflows streamlining multi-step operations",
          "Co-authored GTM strategy with Sales/BD; established commercial KPIs"
        ],
        caseStudy: caseStudies["llm-therapy"]
      },
      {
        title: "Product Manager II",
        start: "2024-07",
        end: "2025-03",
        tags: ["Compliance", "GTM", "Product Strategy"],
        highlights: [
          "Expanded EVV capabilities across PMS; 100% regulatory compliance for 50+ providers",
          "Optimized PDLC → 15% faster time-to-market",
          "Post-launch engagement increased by 10%"
        ],
        caseStudy: caseStudies["evv-compliance"]
      },
      {
        title: "Product Manager I",
        start: "2023-08",
        end: "2024-06",
        tags: ["Product Strategy", "Data/Analytics"],
        highlights: [
          "Led new product development in ABA from discovery to launch",
          "Identified $1.6M+ revenue opportunity through market analysis",
          "Built foundational data infrastructure enabling advanced analytics"
        ]
      }
    ]
  },
  {
    org: "Cognizant Technology Solutions",
    location: "Gurugram & Pune, India",
    roles: [
      {
        title: "Product Owner & BD Lead",
        start: "2019-05",
        end: "2022-08",
        tags: ["Data/Analytics", "Product Strategy"],
        highlights: [
          "Multi-market data lineage across 7 sources; operated on 4TB+ datasets",
          "Cloud transformation → $100k savings; 40% productivity gains",
          "Roadmap & PoCs for $390M+ modernization programs"
        ],
        caseStudy: caseStudies["data-modernization"]
      },
      {
        title: "Project Manager",
        start: "2017-06",
        end: "2019-04",
        tags: ["Agile Leadership", "Data/Analytics"],
        highlights: [
          "Vendor negotiations → $1.3M savings",
          "Managed 307 contracts across 75 vendors (ACV $130M+)",
          "Automated PO approvals → 90% manual effort reduction"
        ],
        caseStudy: caseStudies["vendor-automation"]
      }
    ]
  }
];

export const education: Education[] = [
  { degree: "PGDM", org: "IIM Udaipur", years: "2015–2017" },
  { degree: "B.Tech", org: "Dehradun Institute of Technology", years: "2009–2013" }
];

export const certifications = [
  "PMP® — Project Management Professional",
  "Microsoft Certified: Azure Fundamentals", 
  "Product Analytics Micro-Certification (PAC)™",
  "Agile Scrum Master"
];

export const skills: Skill[] = [
  { name: "Product Strategy", level: 95, category: "Product" },
  { name: "AI/LLM Integration", level: 90, category: "AI" },
  { name: "Agile Leadership", level: 92, category: "Leadership" },
  { name: "GTM Strategy", level: 88, category: "Business" },
  { name: "Data Analytics", level: 85, category: "Technical" },
  { name: "Compliance", level: 90, category: "Regulatory" },
  { name: "Stakeholder Management", level: 93, category: "Leadership" },
  { name: "Process Automation", level: 87, category: "Technical" }
];

export const toolkit = [
  "JIRA", "PowerBI", "Figma", "Azure", "SQL", "Python", 
  "REST APIs", "A/B Testing", "Agile (Scrum/Kanban)", 
  "Prompt Engineering", "LLM Integration", "Agentic Workflows", 
  "PDLC", "Regulatory Compliance"
];