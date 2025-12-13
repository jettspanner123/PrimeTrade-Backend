import { QueryClient } from "@tanstack/react-query";

export default class QueryClientService {
    static queryClient: QueryClient;

    public static getInstance(): QueryClient {
        if (!QueryClientService.queryClient) {
            QueryClientService.queryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            });
        }
        return QueryClientService.queryClient;
    }
}
