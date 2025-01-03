import { Currency } from "../types/savings";

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
    currencyDisplay: "narrowSymbol",
  })
    .format(amount)
    .replace(currency.code, currency.symbol);
}
