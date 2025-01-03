import { MonthlyTarget } from "../types/savings";

export function calculateMonthlySavings(baseAmount: number): MonthlyTarget[] {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month, index) => {
    const amount = baseAmount * (index + 1);
    return {
      month,
      amount,
      isCompleted: false,
    };
  });
}

export function calculateYearTotal(baseAmount: number): number {
  return Array.from({ length: 12 }, (_, i) => baseAmount * (i + 1)).reduce(
    (acc, curr) => acc + curr,
    0
  );
}
