import { MonthlyTarget } from "../types/savings";

export function calculateMonthlySavings(
  baseAmount: number,
  dict: any,
  isInverted: boolean = false
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
    const multiplier = isInverted ? 12 - index : index + 1;
    const amount = baseAmount * multiplier;
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
