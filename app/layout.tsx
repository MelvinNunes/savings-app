import ClientProvider from "@/components/client-provider";
import { Geist } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Savings Challenge",
  description: "Track your savings goals, monitor progress, and join a community of savers in our interactive money-saving challenge. Start building your financial future today.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={geistSans.className}>
      <body className="bg-background text-foreground">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
