import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import Image from "next/image"

export default function LanguageSelector() {
    const { t, i18n } = useTranslation()
    return (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 ">
                        <GlobeIcon />
                        <span className="hidden md:inline">{t('lang.label')}</span>
                        {i18n.resolvedLanguage === "pt" ? <Image src="https://flagcdn.com/pt.svg" alt="Mozambique flag" width={20} height={20} /> : <Image src="https://flagcdn.com/gb.svg" alt="UK flag" width={20} height={20} />}
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white">
                    <DropdownMenuLabel>{t('lang.select')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => i18n.changeLanguage("pt")} className="hover:bg-slate-100 cursor-pointer">
                        <div className="flex items-center justify-between gap-3">
                            <span>{t('lang.options.pt')}</span>
                            <Image src="https://flagcdn.com/pt.svg" alt="PT flag" width={20} height={20} />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => i18n.changeLanguage("en")} className="hover:bg-slate-100 cursor-pointer">
                        <div className="flex items-center justify-between gap-3">
                            <span>{t('lang.options.en')}</span>
                            <Image src="https://flagcdn.com/gb.svg" alt="UK flag" width={20} height={20} />
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}


function ChevronDownIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}


function GlobeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    )
}