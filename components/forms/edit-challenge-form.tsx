'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CurrencySelector } from '../currency-selector'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { challengesTypes, SavingsChallenge } from '@/types/savings'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Icons } from '../icons'
import { Card, CardContent } from '../ui/card'

interface EditChallengeFormProps {
    challenge: SavingsChallenge
    onCancel: () => void
    onSave: (challenge: SavingsChallenge) => void
    dict: any
}


export function EditChallengeForm({ challenge, onCancel, onSave, dict }: EditChallengeFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(challenge.name)
    const [description, setDescription] = useState(challenge.description || '')
    const [baseAmount, setBaseAmount] = useState(challenge.baseAmount.toString())
    const [currencyCode, setCurrencyCode] = useState(challenge.currencyCode)
    const [type, setType] = useState(challenge.type)

    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const updatedChallenge = {
                ...challenge,
                name,
                description,
                type,
                baseAmount: Number(baseAmount),
                currencyCode,
                progress: challenge.progress.map(month => ({
                    ...month,
                    amount: type === 'fixed' ? Number(baseAmount) : Number(baseAmount) * (challenge.progress.indexOf(month) + 1)
                })),
                updatedAt: new Date().toISOString()
            }

            const { error } = await supabase
                .from('savings_challenges')
                .update(updatedChallenge)
                .eq('id', challenge.id)

            if (error) throw error

            onSave(updatedChallenge)
            router.refresh()
        } catch (error) {
            console.error('Error updating challenge:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Challenge</h1>
                <p className="text-muted-foreground">
                    Update your savings challenge details
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Challenge Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Challenge Type</Label>
                                <RadioGroup value={type} onValueChange={(value: string) => setType(value as "incremental" | "fixed" | "custom")} className="grid gap-4">
                                    {challengesTypes(dict).map((challengeType) => (
                                        <div key={challengeType.id} className="flex items-start space-x-3">
                                            <RadioGroupItem value={challengeType.name} id={challengeType.id} className="mt-1" />
                                            <Label htmlFor={challengeType.id} className="font-normal grid gap-1">
                                                <div className="font-medium">{challengeType.name}</div>
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
                                    <Label htmlFor="baseAmount">Base Amount</Label>
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
                                    <Label>Currency</Label>
                                    <CurrencySelector
                                        value={currencyCode}
                                        onValueChange={setCurrencyCode}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

