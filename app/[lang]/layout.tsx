import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'pt' }];
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={inter.className}>{children}</div>
    );
}
