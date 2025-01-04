'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateMonthlySavings, calculateYearTotal } from '../utils/calculate-savings'
import { MonthlyTarget, CURRENCIES } from '../types/savings'
import { InsightsCard } from './insights-card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Icons } from './icons'
import { Alert, AlertDescription } from './ui/alert'
import { Confetti } from './confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { CurrencySelector } from './currency-selector'
import { formatCurrency } from '../utils/format-currency'
import { LanguageSwitcher } from './language-switcher'
import { UpgradeBanner } from './upgrade-banner'
import { ThemeSwitcher } from './theme-switcher'
import { getUser } from '@/lib/auth'
import { removeAuthToken } from '@/lib/token.utils'
import LoadingSpinner from './loading-spinner'
import Link from 'next/link'

interface SavingsCalculatorProps {
    lang: string
    dict: any
    isAuthenticated: boolean
}

export default function SavingsCalculator({ lang, dict, isAuthenticated }: SavingsCalculatorProps) {
    const [isLoading, setIsLoading] = useState(isAuthenticated)
    const [, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [baseAmount, setBaseAmount] = useState<number>(200)
    const [currencyCode, setCurrencyCode] = useState<string>('MZN')
    const [monthlySavings, setMonthlySavings] = useState<MonthlyTarget[]>(
        calculateMonthlySavings(200, dict)
    )
    const [showConfetti, setShowConfetti] = useState(false)
    const supabase = createClientComponentClient()

    const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]

    useEffect(() => {
        if (isAuthenticated) {
            loadSavingsProgress()
        }
    }, [isAuthenticated])

    const loadSavingsProgress = async () => {
        try {
            const user = await getUser()
            if (!user) throw new Error('User not found')

            const { data, error } = await supabase
                .from('savings_progress')
                .select('*')
                .eq('user_id', user.id)
                .limit(1)

            if (error) throw error

            if (data && data.length > 0) {
                setBaseAmount(data[0].base_amount)
                setCurrencyCode(data[0].currency_code || 'MZN')
                setMonthlySavings(data[0].progress as MonthlyTarget[])
            }
        } catch (err) {
            console.error('Error loading progress:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBaseAmountChange = (value: string) => {
        const amount = Number(value)
        if (!isNaN(amount) && amount > 0) {
            setBaseAmount(amount)
            setMonthlySavings(calculateMonthlySavings(amount, dict))
        }
    }

    const handleCurrencyChange = (code: string) => {
        setCurrencyCode(code)
    }

    const toggleMonthCompletion = async (index: number) => {
        try {
            setIsSaving(true)
            setError(null)

            const newSavings = monthlySavings.map((saving, i) =>
                i === index ? { ...saving, isCompleted: !saving.isCompleted } : saving
            )

            // Check if this completion marks a milestone
            const completedCount = newSavings.filter(s => s.isCompleted).length
            const previousCount = monthlySavings.filter(s => s.isCompleted).length
            if (completedCount > previousCount && [3, 6, 9, 12].includes(completedCount)) {
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 3000)
            }

            // Only attempt to save to Supabase if authenticated
            if (isAuthenticated) {
                const user = await getUser()
                if (!user) throw new Error('User not found')

                const { error } = await supabase
                    .from('savings_progress')
                    .upsert({
                        user_id: user.id,
                        base_amount: baseAmount,
                        currency_code: currencyCode,
                        progress: newSavings,
                        updated_at: new Date().toISOString()
                    })

                if (error) throw error
            }

            // Always update local state
            setMonthlySavings(newSavings)
        } catch (err) {
            console.error('Error saving progress:', err)
            if (isAuthenticated) {
                setError('Failed to save progress. Please try again.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    const totalSaved = monthlySavings
        .filter(saving => saving.isCompleted)
        .reduce((acc, curr) => acc + curr.amount, 0)

    const yearTotal = calculateYearTotal(baseAmount)
    const progress = (totalSaved / yearTotal) * 100

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }


    return (
        <div className="space-y-6 pb-24">
            {showConfetti && <Confetti />}

            <SavingsHeader dict={dict} lang={lang} />

            {!isAuthenticated && <NotAuthAlert dict={dict} />}

            <InsightsCard
                monthlySavings={monthlySavings}
                baseAmount={baseAmount}
                yearTotal={yearTotal}
                currency={currency}
                dict={dict}
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                    <CardTitle>{dict.savings.plan.title}</CardTitle>
                    <CardDescription>
                        {dict.savings.plan.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="baseAmount">{dict.savings.plan.baseAmount}</Label>
                            <Input
                                id="baseAmount"
                                type="number"
                                min="1"
                                value={baseAmount}
                                onChange={(e) => handleBaseAmountChange(e.target.value)}
                                className="max-w-xs dark:bg-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{dict.savings.plan.currency}</Label>
                            <CurrencySelector
                                value={currencyCode}
                                onValueChange={handleCurrencyChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{dict.savings.plan.progress}</span>
                            <span>
                                {formatCurrency(totalSaved, currency)} / {formatCurrency(yearTotal, currency)}
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                            <motion.div
                                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {monthlySavings.map((saving, index) => (
                                <motion.div
                                    key={saving.month}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${saving.isCompleted ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-violet-200' : ''
                                            }`}
                                        onClick={() => toggleMonthCompletion(index)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{saving.month}</div>
                                                <div className={`transition-colors ${saving.isCompleted ? 'text-violet-600 font-semibold' : ''}`}>
                                                    {formatCurrency(saving.amount, currency)}
                                                </div>
                                            </div>
                                            {saving.isCompleted && (
                                                <div className="mt-2 text-xs text-violet-600 flex items-center gap-1">
                                                    <Sparkles className="h-3 w-3" />
                                                    {dict.savings.plan.completed}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>

            {!isAuthenticated && <UpgradeBanner lang={lang} dict={dict} />}
        </div>
    )
}



function SavingsHeader({ dict, lang }: { dict: any, lang: string }) {
    return (
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 dark:from-violet-900 to-indigo-600 dark:to-indigo-900 p-8 text-white dark:text-slate-200">
            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{dict.savings.title}</h1>
                    <p className="text-white/80">{dict.savings.subtitle}</p>
                </div>
                <div className='flex justify-between gap-3'>
                    <LanguageSwitcher currentLang={lang} />
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    )
}

function NotAuthAlert({ dict }: { dict: any }) {
    return (
        <Alert className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
                {dict.savings.notAuth.title}{' '}
                <Link href="/" className="font-medium text-amber-700 hover:text-amber-900 underline underline-offset-4">
                    {dict.auth.signInWithEmail}
                </Link>
                {' '}{dict.savings.notAuth.save}
            </AlertDescription>
        </Alert>
    )
}