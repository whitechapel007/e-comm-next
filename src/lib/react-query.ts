import { QueryClient } from "@tanstack/react-query";

// Called once per client-side app mount (in Providers).
// Stable instance is kept in useState so it's never recreated on re-render.
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't retry on 4xx errors — they're not transient
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes("40")) return false;
          return failureCount < 1;
        },
        staleTime:            60_000,  // 1 min before background refetch
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
