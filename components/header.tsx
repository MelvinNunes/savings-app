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
import AuthSheet from './auth-sheet'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'

interface HeaderProps {
    view?: 'dashboard' | 'calculator'
    isAuthenticated: boolean
    dict: any
    lang: string
}

export function Header({ view, isAuthenticated, dict, lang }: HeaderProps) {
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }


    const navigation = [
        {
            name: dict.header.navigation.dashboard,
            href: '/',
            icon: LayoutDashboard,
            current: view === 'dashboard'
        },
        {
            name: dict.header.navigation.calculator,
            href: '/calculator',
            icon: PiggyBank,
            current: view === 'calculator'
        },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-slate-800">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <PiggyBank className="h-6 w-6 text-violet-600 dark:text-violet-700" />
                        <span className="hidden font-bold sm:inline-block text-violet-600 dark:text-violet-700">
                            {dict.header.branding.name}
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
                    <div className='flex justify-between gap-3'>
                        <LanguageSwitcher currentLang={lang} />
                        <ThemeSwitcher />
                    </div>
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">{dict.header.accountMenu.account}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                {isAuthenticated && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/" className="flex items-center gap-2">
                                                <LayoutDashboard className="h-4 w-4" />
                                                {dict.header.accountMenu.dashboard}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/calculator" className="flex items-center gap-2">
                                                <PiggyBank className="h-4 w-4" />
                                                {dict.header.accountMenu.calculator}
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
                                    {dict.header.accountMenu.signOut}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <AuthSheet dict={dict} lang={lang} isHeader={true} />
                    )}
                </div>
            </div>
        </header>
    )
}

