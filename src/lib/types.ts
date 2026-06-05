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


export type ApiMeta = {
  source: "mock" | "database";
  total?: number;
  persisted?: boolean;
};

export type ApiSuccess<T> = {
  data: T;
  meta: ApiMeta;
};

export type ApiError = {
  errors: string[];
  code?: string;
};

export type SalaryListResponse = ApiSuccess<SalarySubmission[]>;

export type SalaryIngestionRequest = SubmissionDraft;

export type SalaryIngestionResponse = ApiSuccess<
  SubmissionDraft & {
    bonus: number;
    stock: number;
    totalComp: number;
    totalCompUsd: number;
  }
>;

export type CompanyListResponse = ApiSuccess<CompanySummary[]>;

export type CompanyDetail = {
  summary: CompanySummary;
  rows: SalarySubmission[];
  levelBands: Array<{
    level: string;
    levelRank: number;
    medianUsd: number;
    sampleSize: number;
  }>;
};

export type CompanyDetailResponse = ApiSuccess<CompanyDetail>;

export type ComparisonInsight = {
  highestTotal: SalarySubmission;
  mostCashHeavy: SalarySubmission;
};

export type ComparisonResponse = ApiSuccess<{
  rows: SalarySubmission[];
  insight: ComparisonInsight;
}>;

export type FilterOptions = {
  companies: string[];
  roles: string[];
  levels: string[];
  locations: string[];
};

export type DashboardData = {
  companies: Company[];
  salaries: SalarySubmission[];
  researchRows: ResearchRow[];
  filterOptions: FilterOptions;
};
