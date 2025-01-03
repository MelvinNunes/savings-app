import { MonthlyTarget } from "../types/savings";

export function calculateMonthlySavings(
  baseAmount: number,
  dict: any
): MonthlyTarget[] {
  const months = [
    dict.months.january,
    dict.months.february,
    dict.months.march,
    dict.months.april,
    dict.months.may,
    dict.months.june,
    dict.months.july,
    dict.months.august,
    dict.months.september,
    dict.months.october,
    dict.months.november,
    dict.months.december,
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
