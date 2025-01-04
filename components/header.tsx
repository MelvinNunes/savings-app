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
import { removeAuthToken } from '@/lib/token.utils'

interface HeaderProps {
    view: 'dashboard' | 'calculator'
}

export function Header({ view }: HeaderProps) {
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        removeAuthToken()
        router.refresh()
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
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <PiggyBank className="h-6 w-6 text-violet-600" />
                        <span className="hidden font-bold sm:inline-block">
                            Savings Challenge
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80 flex items-center gap-2",
                                    item.current ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2">
                                <User className="h-4 w-4" />
                                Account
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

