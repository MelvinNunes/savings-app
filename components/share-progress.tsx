'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SavingsChallenge } from '@/types/savings'
import { Share2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { formatCurrency } from '@/utils/format-currency'
import { CURRENCIES } from '@/types/savings'

interface ShareProgressProps {
    challenge: SavingsChallenge
}

export function ShareProgress({ challenge }: ShareProgressProps) {
    const [isSharing, setIsSharing] = useState(false)
    const [shared, setShared] = useState(false)

    const currency = CURRENCIES.find(c => c.code === challenge.currencyCode) || CURRENCIES[0]
    const completedCount = challenge.progress.filter(m => m.isCompleted).length
    const totalMonths = challenge.progress.length
    const progress = (completedCount / totalMonths) * 100
    const totalSaved = challenge.progress
        .filter(m => m.isCompleted)
        .reduce((sum, m) => sum + m.amount, 0)

    const shareText = `🎯 ${challenge.name}\n` +
        `💰 Saved: ${formatCurrency(totalSaved, currency)}\n` +
        `📈 Progress: ${Math.round(progress)}%\n` +
        `🎉 ${completedCount}/${totalMonths} months completed\n` +
        `\n#SavingsChallenge #PersonalFinance`

    const handleShare = async () => {
        setIsSharing(true)
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'My Savings Progress',
                    text: shareText,
                })
            } else {
                await navigator.clipboard.writeText(shareText)
            }
            setShared(true)
            setTimeout(() => setShared(false), 2000)
        } catch (error) {
            console.error('Error sharing:', error)
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Progress
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Your Progress</DialogTitle>
                    <DialogDescription>
                        Share your savings achievement with others
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                        {shareText}
                    </div>
                    <Button
                        className="w-full gap-2"
                        onClick={handleShare}
                        disabled={isSharing}
                    >
                        <Share2 className="h-4 w-4" />
                        {shared ? 'Copied!' : isSharing ? 'Sharing...' : 'Share'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

