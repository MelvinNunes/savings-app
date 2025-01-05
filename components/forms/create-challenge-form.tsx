'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CurrencySelector } from '../currency-selector'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter } from 'next/navigation'
import { Icons } from '../icons'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCreateChallenge } from '@/data/challenges'
import { useAtom } from 'jotai'
import { addedChallengeCountAtom } from '@/atom/challenge-atoms'
import { getUser } from '@/lib/auth'
import { challengesTypes } from '@/types/savings'
import { Switch } from '../ui/switch'
import { calculateMonthlySavings } from '@/utils/calculate-savings'

interface FormProps {
    dict: any
}

export function CreateChallengeForm({ dict }: FormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [baseAmount, setBaseAmount] = useState('200')
    const [currencyCode, setCurrencyCode] = useState('USD')
    const [type, setType] = useState('incremental')
    const [isInverted, setIsInverted] = useState(false)

    const router = useRouter()
    const [, setAddedChallengeCount] = useAtom(addedChallengeCountAtom)

    const { createChallenge } = useCreateChallenge()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const user = await getUser();
            if (!user) throw new Error("Not authenticated");

            const challenge = {
                name,
                description,
                type,
                baseAmount: Number(baseAmount),
                currencyCode,
                startDate: new Date().toISOString(),
                progress: type === 'incremental'
                    ? calculateMonthlySavings(Number(baseAmount), dict, isInverted)
                    : Array.from({ length: 12 }, (_, i) => ({
                        month: new Date(2025, i).toLocaleString('default', { month: 'long' }),
                        amount: Number(baseAmount),
                        isCompleted: false
                    })),
                isInverted,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user_id: user.id
            }

            createChallenge(challenge, {
                onSuccess: () => {
                    setAddedChallengeCount((addedChallengeCount) => addedChallengeCount + 1)
                }
            })

            router.push('/')
        } catch (err) {
            console.error("Error creating challenge:", err);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{dict.createChallenge.title}</h1>
                    <p className="text-muted-foreground">
                        {dict.createChallenge.description}
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
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
                                <Label htmlFor="description">{dict.createChallenge.inputDescription}</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{dict.createChallenge.type}</Label>
                                <RadioGroup value={type} onValueChange={setType} className="grid gap-4">
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
                        <div className="flex gap-4">
                            <Button variant="outline" asChild>
                                <Link href="/">{dict.createChallenge.cancel}</Link>
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {dict.createChallenge.create}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

