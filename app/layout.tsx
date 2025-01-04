import ClientProvider from "@/components/client-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
