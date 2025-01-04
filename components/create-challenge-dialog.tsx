'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CurrencySelector } from './currency-selector'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Icons } from './icons'
import { getUser } from '@/lib/auth'

interface CreateChallengeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    dict: any
}

export function CreateChallengeDialog({ open, onOpenChange, dict }: CreateChallengeDialogProps) {
    // to refactor, use zod
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [baseAmount, setBaseAmount] = useState('200')
    const [currencyCode, setCurrencyCode] = useState('MZN')
    const [type, setType] = useState('incremental')

    const router = useRouter()
    const supabase = createClientComponentClient()

    const CHALLENGE_TYPES = [
        {
            id: "incremental",
            name: dict.challengeTypes.incremental.name,
            description: dict.challengeTypes.incremental.description,
        },
        {
            id: "fixed",
            name: dict.challengeTypes.fixed.name,
            description: dict.challengeTypes.fixed.description,
        },
        {
            id: "custom",
            name: dict.challengeTypes.custom.name,
            description: dict.challengeTypes.custom.description,
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const user = await getUser()
            if (!user) throw new Error('Not authenticated')

            const challenge = {
                name,
                description,
                type,
                baseAmount: Number(baseAmount),
                currencyCode,
                startDate: new Date().toISOString(),
                progress: Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(2025, i).toLocaleString('default', { month: 'long' }),
                    amount: type === 'fixed' ? Number(baseAmount) : Number(baseAmount) * (i + 1),
                    isCompleted: false
                })),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const { error } = await supabase
                .from('savings_challenges')
                .insert([{ ...challenge, user_id: user.id }])

            if (error) throw error

            router.refresh()
            onOpenChange(false)
        } catch (error) {
            console.error('Error creating challenge:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{dict.createChallenge.title}</DialogTitle>
                    <DialogDescription>
                        {dict.createChallenge.description}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{dict.createChallenge.name}</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">{dict.createChallenge.description}</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{dict.createChallenge.type}</Label>
                            <RadioGroup value={type} onValueChange={setType}>
                                {CHALLENGE_TYPES.map((challengeType) => (
                                    <div key={challengeType.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={challengeType.id} id={challengeType.id} />
                                        <Label htmlFor={challengeType.id} className="font-normal">
                                            <div>{challengeType.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {challengeType.description}
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="baseAmount">{dict.createChallenge.baseAmount}</Label>
                                <Input
                                    id="baseAmount"
                                    type="number"
                                    min="1"
                                    value={baseAmount}
                                    onChange={(e) => setBaseAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{dict.createChallenge.currency}</Label>
                                <CurrencySelector
                                    value={currencyCode}
                                    onValueChange={setCurrencyCode}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {dict.createChallenge.create}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

