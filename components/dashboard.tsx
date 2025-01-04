'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Archive, ArrowUpRight, CheckCircle2, Clock, PlusCircle, TrendingUp, Wallet } from 'lucide-react'
import { SavingsChallenge } from '@/types/savings'
import { CreateChallengeDialog } from './create-challenge-dialog'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils/format-currency'
import Link from 'next/link'
import { CURRENCIES } from '@/types/savings'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

interface DashboardProps {
    dict: any
    challenges: SavingsChallenge[]
}

export function Dashboard({ challenges, dict }: DashboardProps) {
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
    const archivedCount = challenges.filter(c => c.isArchived).length

    const stats = [
        {
            title: 'Total Saved',
            value: formatCurrency(totalSaved, CURRENCIES[0]),
            description: 'Across all challenges',
            icon: Wallet,
            trend: '+12.3% from last month',
            trendUp: true,
        },
        {
            title: 'Active Challenges',
            value: activeCount.toString(),
            description: `${completedCount} completed`,
            icon: TrendingUp,
            trend: `${archivedCount} archived`,
            trendUp: false,
        },
    ]

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-12 text-white">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Your Savings Challenges</h1>
                        <p className="text-white/80 max-w-[600px]">
                            Track and manage your savings goals. Create multiple challenges, set targets,
                            and watch your savings grow over time.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-white/90"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Challenge
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between space-y-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-3xl font-bold tracking-tight">
                                                {stat.value}
                                            </h2>
                                            <Badge
                                                variant={stat.trendUp ? 'default' : 'secondary'}
                                                className="font-normal"
                                            >
                                                {stat.trend}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-violet-100 p-3 text-violet-600 dark:bg-violet-900">
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6">
                {challenges.map((challenge, index) => {
                    const completedCount = challenge.progress.filter(m => m.isCompleted).length
                    const totalMonths = challenge.progress.length
                    const progress = (completedCount / totalMonths) * 100
                    const currency = CURRENCIES.find(c => c.code === challenge.currencyCode) || CURRENCIES[0]
                    const totalSaved = challenge.progress
                        .filter(m => m.isCompleted)
                        .reduce((sum, m) => sum + m.amount, 0)

                    let status
                    if (challenge.isArchived) {
                        status = { label: 'Archived', icon: Archive, color: 'text-yellow-600' }
                    } else if (completedCount === totalMonths) {
                        status = { label: 'Completed', icon: CheckCircle2, color: 'text-green-600' }
                    } else {
                        status = { label: 'In Progress', icon: Clock, color: 'text-blue-600' }
                    }

                    return (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/challenge/${challenge.id}`}>
                                <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{challenge.name}</h3>
                                                    <Badge variant="outline" className="font-normal">
                                                        {challenge.type}
                                                    </Badge>
                                                </div>
                                                {challenge.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {challenge.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <status.icon className={`h-4 w-4 ${status.color}`} />
                                                <span>{status.label}</span>
                                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Progress</span>
                                                    <span className="text-muted-foreground">
                                                        {completedCount}/{totalMonths} months
                                                    </span>
                                                </div>
                                                <span className="font-medium">
                                                    {formatCurrency(totalSaved, currency)}
                                                </span>
                                            </div>
                                            <Progress value={progress} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>
                                                    Base: {formatCurrency(challenge.baseAmount, currency)}/month
                                                </span>
                                                <span>Started {new Date(challenge.startDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    )
                })}
            </div>

            <CreateChallengeDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                dict={dict}
            />
        </div>
    )
}

