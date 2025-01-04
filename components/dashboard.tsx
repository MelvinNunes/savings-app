'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, TrendingUp, Wallet } from 'lucide-react'
import { SavingsChallenge } from '@/types/savings'
import { CreateChallengeDialog } from './create-challenge-dialog'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils/format-currency'
import Link from 'next/link'
import { CURRENCIES } from '@/types/savings'

interface DashboardProps {
    challenges: SavingsChallenge[]
    dict: any
    lang: string
}

export function Dashboard({ challenges, dict, lang }: DashboardProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    const totalSaved = challenges.reduce((total, challenge) => {
        const challengeTotal = challenge.progress
            .filter(month => month.isCompleted)
            .reduce((sum, month) => sum + month.amount, 0)
        return total + challengeTotal
    }, 0)

    const activeCount = challenges.filter(c => !c.isArchived).length
    const completedCount = challenges.filter(c =>
        c.progress.every(month => month.isCompleted)
    ).length

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{dict.dashboard.title}</h1>
                    <p className="text-muted-foreground">{dict.dashboard.subtitle}</p>
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {dict.dashboard.newChallenge}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {dict.dashboard.stats.totalSaved}
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(totalSaved, CURRENCIES[0])}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {dict.dashboard.stats.acrossAllChallenges}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {dict.dashboard.stats.activeChallenges}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedCount} {dict.dashboard.stats.completed}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {challenges.map((challenge, index) => (
                    <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={`/${lang}/challenge/${challenge.id}`}>
                            <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <CardTitle>{challenge.name}</CardTitle>
                                    <CardDescription>{challenge.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{dict.dashboard.progress}</span>
                                            <span>
                                                {challenge.progress.filter(m => m.isCompleted).length}/
                                                {challenge.progress.length} {dict.dashboard.months}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-secondary">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                                                style={{
                                                    width: `${(challenge.progress.filter(m => m.isCompleted).length /
                                                        challenge.progress.length) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>
                                                {formatCurrency(
                                                    challenge.progress
                                                        .filter(m => m.isCompleted)
                                                        .reduce((sum, m) => sum + m.amount, 0),
                                                    CURRENCIES.find(c => c.code === challenge.currencyCode) || CURRENCIES[0]
                                                )}
                                            </span>
                                            <span>{challenge.type}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <CreateChallengeDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                dict={dict}
            />
        </div>
    )
}

