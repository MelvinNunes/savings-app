"use client";

import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ThemeProvider } from "next-themes";
import React from "react";

const queryClient = new QueryClient();

export default function ClientProvider({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </Hydrate>
        </QueryClientProvider>
    );
}
