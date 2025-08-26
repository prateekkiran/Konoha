export interface Profile {
  name: string;
  title: string;
  email: string;
  location: string;
  tagline: string;
  subline: string;
  links: {
    linkedin: string;
  };
}

export interface KPI {
  label: string;
  value: number;
  suffix?: string;
  description?: string;
}

export interface Role {
  title: string;
  start: string;
  end: string;
  tags: string[];
  highlights: string[];
  caseStudy?: CaseStudy;
}

export interface Organization {
  org: string;
  location?: string;
  roles: Role[];
}

export interface CaseStudy {
  title: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  impact: string[];
}

export interface Education {
  degree: string;
  org: string;
  years: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface FilterState {
  activeFilters: string[];
  searchTerm: string;
}