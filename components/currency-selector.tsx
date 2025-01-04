import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CURRENCIES } from '../types/savings'

interface CurrencySelectorProps {
    value: string
    onValueChange: (value: string) => void
}

export function CurrencySelector({ value, onValueChange }: CurrencySelectorProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[180px] dark:border-black">
                <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
                {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

