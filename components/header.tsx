'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LayoutDashboard, LogOut, PiggyBank, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Icons } from './icons'
import { useState } from 'react'

interface HeaderProps {
    view?: 'dashboard' | 'calculator'
    isAuthenticated: boolean
}

export function Header({ view, isAuthenticated }: HeaderProps) {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [isLoading, setIsLoading] = useState(false)

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err) {
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const navigation = [
        {
            name: 'Dashboard',
            href: '/',
            icon: LayoutDashboard,
            current: view === 'dashboard'
        },
        {
            name: 'Calculator',
            href: '/calculator',
            icon: PiggyBank,
            current: view === 'calculator'
        },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <PiggyBank className="h-6 w-6 text-violet-600" />
                        <span className="hidden font-bold sm:inline-block text-violet-600 ">
                            Savings Challenge
                        </span>
                    </Link>
                    {isAuthenticated && (
                        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                                        item.current ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Account</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                {isAuthenticated && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/" className="flex items-center gap-2">
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/calculator" className="flex items-center gap-2">
                                                <PiggyBank className="h-4 w-4" />
                                                Calculator
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem
                                    className="flex items-center gap-2 text-red-600"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                        >
                            {isLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.google className="mr-2 h-4 w-4" />
                            )}
                            Sign in with Google
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}

