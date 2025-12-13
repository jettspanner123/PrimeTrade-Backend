"use client";
import QueryClientService from "@/lib/tanstack-query-client";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

type TanstackQueryClientProviderProps = {
    children: React.ReactNode;
};

export default function TanstackQueryClientProvider({
    children,
}: TanstackQueryClientProviderProps): React.ReactNode {
    const queryClient = QueryClientService.getInstance();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
