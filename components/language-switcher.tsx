'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' }
]

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLanguageChange = (newLang: string) => {
        const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`)
        router.push(newPathname)
    }

    return (
        <Select value={currentLang} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

