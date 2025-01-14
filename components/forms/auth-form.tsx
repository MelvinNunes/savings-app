'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useLoginWithPassword, useRegisterWithPassword } from '@/lib/auth'
import { Icons } from '../icons'

interface AuthFormProps {
    lang: string
    dict: any
}

export function AuthForm({ lang, dict }: AuthFormProps) {
    // needs improvement, add zod and form validation
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const error = await useLoginWithPassword({ email, password })
        if (error) {
            setError(error.message)
        }
        setIsLoading(false)
        router.push(`/`)
    }

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        const error = await useRegisterWithPassword({
            email,
            password
        })
        if (error) {
            setError(error.message)
        } else {
            setError(dict.auth.checkEmail)
        }
        setIsLoading(false)
        router.push(`/`)
    }


    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="space-y-4 mt-5">
                <Tabs defaultValue="login" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">{dict.auth.signInWithEmail}</TabsTrigger>
                        <TabsTrigger value="register">{dict.auth.signUpWithEmail}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{dict.auth.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{dict.auth.password}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                {dict.auth.signInWithEmail}
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="register">
                        <form onSubmit={handleEmailSignUp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{dict.auth.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{dict.auth.password}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                {dict.auth.signUpWithEmail}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>

                {error && (
                    <Alert variant={error.includes('Check your email') ? 'default' : 'destructive'}>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {dict.auth.orContinueWith}
                        </span>
                    </div>
                </div> */}
            </CardContent>
        </Card>
    )
}

