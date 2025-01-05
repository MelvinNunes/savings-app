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
  { code: "AOA", symbol: "Kz", name: "Kwanza" },
];
