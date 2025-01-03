import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'pt' }]
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { lang: string }
}) {
    return (
        <html lang={params.lang}>
            <body className={inter.className}>{children}</body>
        </html>
    )
}

