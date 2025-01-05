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
import { useEditChallenge } from '@/data/challenges'
import { Switch } from '../ui/switch'
import { calculateMonthlySavings } from '@/utils/calculate-savings'

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
    const [isInverted, setIsInverted] = useState(challenge.isInverted || false)

    const router = useRouter()

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
                isInverted,
                progress: type === 'incremental'
                    ? calculateMonthlySavings(Number(baseAmount), dict, isInverted)
                    : Array.from({ length: 12 }, (_, i) => ({
                        month: new Date(2025, i).toLocaleString('default', { month: 'long' }),
                        amount: Number(baseAmount),
                        isCompleted: false
                    })),
                updatedAt: new Date().toISOString()
            }

            const error = await useEditChallenge(challenge.id, updatedChallenge)
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
                <h1 className="text-2xl font-bold tracking-tight">{dict.editChallenge.title}</h1>
                <p className="text-muted-foreground">
                    {dict.editChallenge.description}
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{dict.editChallenge.name}</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">{dict.editChallenge.inputDescription}</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{dict.editChallenge.type}</Label>
                                <RadioGroup value={type} onValueChange={(value: string) => setType(value as "incremental" | "fixed" | "custom")} className="grid gap-4">
                                    {challengesTypes(dict).map((challengeType) => (
                                        <div key={challengeType.id} className="flex items-start space-x-3">
                                            <RadioGroupItem value={challengeType.id} id={challengeType.id} className="mt-1" />
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
                                    <Label htmlFor="baseAmount">{dict.editChallenge.baseAmount}</Label>
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
                                    <Label>{dict.editChallenge.currency}</Label>
                                    <CurrencySelector
                                        value={currencyCode}
                                        onValueChange={setCurrencyCode}
                                    />
                                </div>
                                {type === 'incremental' && (
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="inverted" className="flex flex-col space-y-1">
                                            <span>Invert Monthly Order</span>
                                            <span className="font-normal text-sm text-muted-foreground">
                                                Start with the highest amount and decrease monthly
                                            </span>
                                        </Label>
                                        <Switch
                                            id="inverted"
                                            checked={isInverted}
                                            onCheckedChange={setIsInverted}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                            >
                                {dict.editChallenge.cancel}
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {dict.editChallenge.save}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

