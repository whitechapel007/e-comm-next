"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

import { store } from "@/store";
import { makeQueryClient } from "@/lib/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures a single QueryClient instance per component mount,
  // never shared across requests (SSR safety) and never recreated on re-render.
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}
