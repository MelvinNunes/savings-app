export interface SavingsGoal {
  baseAmount: number;
  monthlyIncrement: number;
  currency: string;
}

export interface MonthlyTarget {
  month: string;
  amount: number;
  isCompleted: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: "MZN", symbol: "MZN", name: "Mozambican Metical" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];
