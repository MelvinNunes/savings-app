export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface MonthlyTarget {
  month: string;
  amount: number;
  isCompleted: boolean;
}

export interface SavingsChallenge {
  id: string;
  name: string;
  description?: string;
  type: "incremental" | "fixed" | "custom";
  baseAmount: number;
  currencyCode: string;
  startDate: string;
  progress: MonthlyTarget[];
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CURRENCIES: Currency[] = [
  { code: "MZN", symbol: "MZN", name: "Metical" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export const CHALLENGE_TYPES = [
  {
    id: "incremental",
    name: "Incremental Savings",
    description: "Save more each month by incrementing your base amount",
  },
  {
    id: "fixed",
    name: "Fixed Monthly Savings",
    description: "Save the same amount each month",
  },
  {
    id: "custom",
    name: "Custom Savings Plan",
    description: "Set your own monthly savings targets",
  },
];
