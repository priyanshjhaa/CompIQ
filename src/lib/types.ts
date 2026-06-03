export type Currency = "USD" | "INR";

export type Market = "Global" | "India";

export type SalarySubmission = {
  id: string;
  companyId: string;
  company: string;
  companySlug: string;
  role: string;
  level: string;
  levelRank: number;
  location: string;
  market: Market;
  currency: Currency;
  base: number;
  bonus: number;
  stock: number;
  totalComp: number;
  totalCompUsd: number;
  yearsExperience: number;
  submittedAt: string;
  verified: boolean;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  market: Market | "Hybrid";
  headquarters: string;
  description: string;
};

export type CompanySummary = Company & {
  sampleSize: number;
  medianTotalUsd: number;
  highestLevel: string;
  topRole: string;
  locations: string[];
};

export type ResearchRow = {
  feature: string;
  levelsFyi: string;
  sixfigr: string;
  ambitionBox: string;
  glassdoor: string;
  build: string;
};

export type SalaryFilters = {
  query: string;
  company: string;
  role: string;
  level: string;
  location: string;
  currency: Currency | "All";
  market: Market | "All";
};

export type SortKey = "totalCompUsd" | "base" | "company" | "levelRank";

export type SubmissionDraft = {
  company: string;
  role: string;
  level: string;
  location: string;
  market: Market;
  currency: Currency;
  base: number;
  bonus?: number;
  stock?: number;
  yearsExperience: number;
};
