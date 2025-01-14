'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Archive, ArrowLeft, BanknoteIcon, Calendar, Edit2, LineChart, MoreVertical, Sparkles, Target, Trash2 } from 'lucide-react'
import { resolveChallengeType, SavingsChallenge } from '@/types/savings'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils/format-currency'
import Link from 'next/link'
import { CURRENCIES } from '@/types/savings'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Icons } from './icons'
import { EditChallengeForm } from './forms/edit-challenge-form'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useArchiveChallenge, useDeleteChallenge, useUpdateChallengeProgress } from '@/data/challenges'
import { InsightsCard } from './insights-card'
import { calculateYearTotal } from '@/utils/calculate-savings'

interface ChallengeDetailsProps {
    challenge: SavingsChallenge
    dict: any
}

export function ChallengeDetails({ challenge: initialChallenge, dict }: ChallengeDetailsProps) {
    const [challenge, setChallenge] = useState(initialChallenge)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMonth, setLoadingMonth] = useState<number | null>(null)
    const router = useRouter()

    const currency = CURRENCIES.find(c => c.code === challenge.currencyCode) || CURRENCIES[0]
    const completedCount = challenge.progress.filter(m => m.isCompleted).length
    const totalMonths = challenge.progress.length
    const progress = (completedCount / totalMonths) * 100
    const totalSaved = challenge.progress
        .filter(m => m.isCompleted)
        .reduce((sum, m) => sum + m.amount, 0)
    const totalTarget = challenge.progress
        .reduce((sum, m) => sum + m.amount, 0)

    const handleToggleMonth = async (index: number) => {
        try {
            setIsLoading(true)
            setLoadingMonth(index)
            const newProgress = challenge.progress.map((month, i) =>
                i === index ? { ...month, isCompleted: !month.isCompleted } : month
            )

            const error = await useUpdateChallengeProgress(challenge.id, newProgress)
            if (error) throw error

            setChallenge(prev => ({
                ...prev,
                progress: newProgress
            }))
            router.refresh()
        } catch (error) {
            console.error('Error updating progress:', error)
        } finally {
            setIsLoading(false)
            setLoadingMonth(null)
        }
    }

    const handleArchive = async () => {
        try {
            setIsLoading(true)
            const error = await useArchiveChallenge(challenge.id, !challenge.isArchived)
            if (error) throw error

            setChallenge(prev => ({
                ...prev,
                isArchived: !prev.isArchived
            }))
            router.refresh()
        } catch (error) {
            console.error('Error archiving challenge:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsLoading(true)

            const error = await useDeleteChallenge(challenge.id)
            if (error) throw error

            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Error deleting challenge:', error)
        } finally {
            setIsLoading(false)
            setIsDeleting(false)
        }
    }

    if (isEditing) {
        return (
            <EditChallengeForm
                dict={dict}
                challenge={challenge}
                onCancel={() => setIsEditing(false)}
                onSave={(updatedChallenge) => {
                    setChallenge(updatedChallenge)
                    setIsEditing(false)
                }}
            />
        )
    }

    const yearTotal = calculateYearTotal(challenge.baseAmount)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{challenge.name}</h1>
                        {challenge.description && (
                            <p className="text-muted-foreground">{challenge.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setIsEditing(true)}
                        disabled={isLoading}
                    >
                        <Edit2 className="h-4 w-4" />
                        {dict.challengeDetails.edit}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isLoading}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleArchive}>
                                <Archive className="mr-2 h-4 w-4" />
                                {challenge.isArchived ? dict.challengeDetails.unarchive : dict.challengeDetails.archive}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setIsDeleting(true)}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {dict.challengeDetails.delete}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{dict.challengeDetails.detailedAnalytics}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold">{dict.challengeDetails.completionRate}</h3>
                            <div className="flex items-center justify-between text-sm">
                                <div className="grid gap-0.5">
                                    <div className="font-medium">{(completedCount / totalMonths * 100).toFixed(1)}%</div>
                                    <div className="text-xs text-muted-foreground">{dict.challengeDetails.target}: 100%</div>
                                </div>
                                <div className="grid gap-0.5 text-right">
                                    <div className="font-medium">{completedCount} {dict.dashboard.months}</div>
                                    <div className="text-xs text-muted-foreground">{dict.challengeDetails.of} {totalMonths} {dict.challengeDetails.total}</div>
                                </div>
                            </div>
                            <Progress value={completedCount / totalMonths * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">{dict.challengeDetails.savingRate}</h3>
                            <div className="flex items-center justify-between text-sm">
                                <div className="grid gap-0.5">
                                    <div className="font-medium">{(totalSaved / totalTarget * 100).toFixed(1)}%</div>
                                    <div className="text-xs text-muted-foreground">
                                        {dict.challengeDetails.target}: {formatCurrency(totalTarget, currency)}
                                    </div>
                                </div>
                                <div className="grid gap-0.5 text-right">
                                    <div className="font-medium">{formatCurrency(totalSaved, currency)}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {dict.challengeDetails.of} {formatCurrency(totalTarget, currency)}
                                    </div>
                                </div>
                            </div>
                            <Progress value={totalSaved / totalTarget * 100} className="h-2" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2">
                                    <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">{dict.challengeDetails.baseAmount}</h3>
                                </div>
                                <div className="mt-2 grid gap-1">
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(challenge.baseAmount, currency)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {resolveChallengeType(challenge.type, dict)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2">
                                    <LineChart className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">{dict.challengeDetails.monthlyGrowth}</h3>
                                </div>
                                <div className="mt-2 grid gap-1">
                                    <div className="text-2xl font-bold">
                                        {challenge.type === 'fixed' ? '0%' : '100%'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {resolveChallengeType(challenge.type, dict)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">{dict.challengeDetails.projectEnd}</h3>
                                </div>
                                <div className="mt-2 grid gap-1">
                                    <div className="text-2xl font-bold">
                                        {new Date(new Date(challenge.startDate).setFullYear(new Date(challenge.startDate).getFullYear() + 1)).toLocaleDateString('default', {
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                        }
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {Math.round((new Date(new Date(challenge.startDate).setFullYear(new Date(challenge.startDate).getFullYear() + 1)).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} {dict.challengeDetails.daysRemaining}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <InsightsCard
                monthlySavings={challenge.progress}
                baseAmount={challenge.baseAmount}
                yearTotal={yearTotal}
                currency={currency}
                dict={dict}
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{dict.challengeDetails.progressOverview}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    {resolveChallengeType(challenge.type, dict)}
                                </Badge>
                                <Badge
                                    variant={challenge.isArchived ? 'secondary' : 'default'}
                                >
                                    {challenge.isArchived ? dict.challengeDetails.archived : dict.challengeDetails.active}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {dict.challengeDetails.started} {new Date(challenge.startDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{dict.challengeDetails.totalProgress}</span>
                                <span>
                                    {formatCurrency(totalSaved, currency)} / {formatCurrency(totalTarget, currency)}
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{dict.challengeDetails.monthsCompleted.replace("{{completed}}", completedCount).replace("{{total}}", totalMonths)}</span>
                                <span>{dict.challengeDetails.percentComplete.replace("{{progress}}", progress.toFixed(0))}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{dict.challengeDetails.monthlyBreakdown}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {challenge.progress.map((month, index) => (
                                <motion.div
                                    key={month.month}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <button
                                        onClick={() => handleToggleMonth(index)}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        <Card className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${month.isCompleted ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-violet-200' : ''
                                            }`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-medium">{month.month}</div>
                                                    <div className={`transition-colors ${month.isCompleted ? 'text-violet-600 font-semibold' : ''}`}>
                                                        {loadingMonth === index ? (
                                                            <Icons.spinner className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            formatCurrency(month.amount, currency)
                                                        )}
                                                    </div>
                                                </div>
                                                {month.isCompleted && (
                                                    <div className="mt-2 text-xs text-violet-600 flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3" />
                                                        {dict.challengeDetails.completed}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dict.challengeDetails.areYouSure}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {dict.challengeDetails.deleteConfirmation}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{dict.challengeDetails.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {dict.challengeDetails.delete}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

