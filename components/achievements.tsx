'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Gift, Rocket, Star, Target, Trophy } from 'lucide-react'
import { motion } from "framer-motion"
import { SavingsChallenge } from "@/types/savings"
import { cn } from "@/lib/utils"

interface Achievement {
    id: string
    title: string
    description: string
    icon: React.ElementType
    condition: (challenges: SavingsChallenge[]) => boolean
}

const achievements: Achievement[] = [
    {
        id: "first_challenge",
        title: "Getting Started",
        description: "Created your first savings challenge",
        icon: Rocket,
        condition: (challenges) => challenges.length >= 1
    },
    {
        id: "three_months",
        title: "Consistent Saver",
        description: "Completed 3 consecutive months in any challenge",
        icon: Star,
        condition: (challenges) => challenges.some(c =>
            c.progress.filter(m => m.isCompleted).length >= 3
        )
    },
    {
        id: "half_way",
        title: "Halfway There",
        description: "Reached 50% in any savings challenge",
        icon: Target,
        condition: (challenges) => challenges.some(c => {
            const completed = c.progress.filter(m => m.isCompleted).length
            return (completed / c.progress.length) >= 0.5
        })
    },
    {
        id: "challenge_complete",
        title: "Challenge Champion",
        description: "Completed an entire savings challenge",
        icon: Trophy,
        condition: (challenges) => challenges.some(c =>
            c.progress.every(m => m.isCompleted)
        )
    },
    {
        id: "multiple_challenges",
        title: "Multi-Tasker",
        description: "Have 3 or more active challenges",
        icon: Gift,
        condition: (challenges) =>
            challenges.filter(c => !c.isArchived).length >= 3
    }
]

export function Achievements({ challenges }: { challenges: SavingsChallenge[] }) {
    const earnedAchievements = achievements.filter(a => a.condition(challenges))
    const unlockedPercentage = (earnedAchievements.length / achievements.length) * 100

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Achievements</CardTitle>
                        <CardDescription>Track your savings milestones</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">
                            {earnedAchievements.length}/{achievements.length}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(unlockedPercentage)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <motion.div
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${unlockedPercentage}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    {achievements.map((achievement) => {
                        const isEarned = achievement.condition(challenges)
                        return (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className={cn(
                                    "transition-colors",
                                    isEarned ? "bg-primary/5 border-primary/20" : "opacity-50"
                                )}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "rounded-full p-2",
                                                isEarned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                            )}>
                                                <achievement.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="font-medium leading-none">
                                                    {achievement.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {achievement.description}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={isEarned ? "default" : "secondary"}
                                                className="ml-auto"
                                            >
                                                {isEarned ? "Earned" : "Locked"}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

