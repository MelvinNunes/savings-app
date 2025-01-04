import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthlyTarget, Currency } from '../types/savings'
import { ArrowUpIcon as ArrowTrendingUpIcon, SparklesIcon, StarIcon, TrophyIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '../utils/format-currency'

interface InsightsCardProps {
  monthlySavings: MonthlyTarget[]
  baseAmount: number
  yearTotal: number
  currency: Currency
  dict: any
}

export function InsightsCard({ monthlySavings, baseAmount, yearTotal, currency, dict }: InsightsCardProps) {
  const completedMonths = monthlySavings.filter(m => m.isCompleted).length
  const totalSaved = monthlySavings
    .filter(m => m.isCompleted)
    .reduce((acc, curr) => acc + curr.amount, 0)

  const currentMonth = new Date().getMonth()
  const isOnTrack = completedMonths >= currentMonth

  const nextTarget = monthlySavings.find(m => !m.isCompleted)?.amount || 0
  const averageSaved = completedMonths > 0 ? totalSaved / completedMonths : 0

  const insights = [
    {
      title: dict.savings.insights.totalSaved,
      value: formatCurrency(totalSaved, currency),
      subtitle: `${((totalSaved / yearTotal) * 100).toFixed(1)}% ${dict.savings.insights.ofYearlyGoal}`,
      icon: TrophyIcon,
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      title: dict.savings.insights.monthlyProgress,
      value: `${completedMonths}/12`,
      subtitle: isOnTrack ? dict.savings.insights.onTrack : dict.savings.insights.keepPushing,
      icon: StarIcon,
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      title: dict.savings.insights.nextTarget,
      value: formatCurrency(nextTarget, currency),
      subtitle: `${formatCurrency(baseAmount, currency)} ${dict.savings.insights.increasePerMonth}`,
      icon: SparklesIcon,
      gradient: 'from-amber-600 to-orange-600',
    },
    {
      title: dict.savings.insights.averageSavings,
      value: formatCurrency(averageSaved, currency),
      subtitle: dict.savings.insights.perCompletedMonth,
      icon: ArrowTrendingUpIcon,
      gradient: 'from-pink-600 to-rose-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
              <insight.icon className={`h-4 w-4 bg-gradient-to-r ${insight.gradient} [&>path]:fill-white`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insight.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {insight.subtitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

