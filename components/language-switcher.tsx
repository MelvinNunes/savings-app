'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'

const languages = [
    { code: 'en', name: 'English', flag: "https://flagcdn.com/gb.svg" },
    { code: 'pt', name: 'Português', flag: "https://flagcdn.com/pt.svg" },
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
            <SelectTrigger className="w-[140px] dark:border-slate-600">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} >
                        <div className='flex gap-2 items-center'>
                            {lang.name} <Image src={lang.flag} alt="PT flag" width={20} height={20} />
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

